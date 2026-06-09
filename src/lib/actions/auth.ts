"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, emailLayout } from "@/lib/email";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) redirect("/login?error=" + encodeURIComponent(error.message));
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const { error } = await supabase.auth.signUp({
    email,
    password: formData.get("password") as string,
    options: { data: { display_name: formData.get("name") as string } },
  });
  if (error) redirect("/signup?error=" + encodeURIComponent(error.message));

  // Generate a confirmation link ourselves and send it via Resend.
  const origin = (await headers()).get("origin") ?? "";
  const admin = createAdminClient();
  const { data: link } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password: formData.get("password") as string,
    options: { redirectTo: `${origin}/auth/confirm?next=/dashboard` },
  });
  if (link?.properties?.action_link) {
    await sendEmail(
      email,
      "Confirm your RAILBIRD account",
      emailLayout(
        "Confirm your account",
        "Tap below to verify your email and start tracking your matches.",
        "Confirm account",
        link.properties.action_link,
      ),
    );
  }
  redirect("/login?message=Check your email to confirm, then log in.");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string;
  const origin = (await headers()).get("origin") ?? "";
  const admin = createAdminClient();
  const { data: link } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo: `${origin}/auth/confirm?next=/reset-password` },
  });
  if (link?.properties?.action_link) {
    await sendEmail(
      email,
      "Reset your RAILBIRD password",
      emailLayout(
        "Reset your password",
        "Tap below to choose a new password. This link expires in an hour.",
        "Reset password",
        link.properties.action_link,
      ),
    );
  }
  // Same message regardless, so we don't reveal which emails are registered.
  redirect(
    "/forgot-password?message=If that email exists, a reset link is on its way.",
  );
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: formData.get("password") as string,
  });
  if (error)
    redirect("/reset-password?error=" + encodeURIComponent(error.message));
  redirect("/login?message=Password updated. Log in with your new password.");
}
