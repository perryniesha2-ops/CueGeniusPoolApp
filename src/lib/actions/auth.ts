"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const admin = createAdminClient();

  // generateLink with type "signup" CREATES the user and returns the
  // confirmation link in one step — no separate signUp() call.
  const { data, error } = await admin.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: {
      data: { display_name: formData.get("name") as string },
    },
  });

  if (error) {
    // Now THIS is where "email already registered" is handled properly —
    // it means a real duplicate, so tell the user.
    if (error.code === "email_exists") {
      redirect(
        "/signup?error=" +
          encodeURIComponent(
            "That email is already registered. Try logging in.",
          ),
      );
    }
    console.error("generateLink failed:", error);
    redirect(
      "/signup?error=" +
        encodeURIComponent("Could not start signup. Please try again."),
    );
  }

  if (data?.properties?.hashed_token) {
    const link = `${siteUrl}/auth/confirm?token_hash=${data.properties.hashed_token}&type=signup&next=/dashboard`;
    const result = await sendEmail(
      email,
      "Confirm your CueGenius account",
      emailLayout(
        "Confirm your account",
        "Tap below to verify your email and start tracking your matches.",
        "Confirm account",
        link,
      ),
    );
    if (!result.ok) {
      redirect(
        "/signup?error=" +
          encodeURIComponent(
            "We couldn't send your confirmation email. Please try again.",
          ),
      );
    }
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.generateLink({
    type: "recovery",
    email,
  });
  console.log(
    "generateLink result:",
    JSON.stringify({
      error,
      hasToken: !!data?.properties?.hashed_token,
      props: data?.properties,
    }),
  );

  if (!error && data?.properties?.hashed_token) {
    const link = `${siteUrl}/auth/confirm?token_hash=${data.properties.hashed_token}&type=recovery&next=/reset-password`;
    const result = await sendEmail(
      email,
      "Reset your CueGenius password",
      emailLayout(
        "Reset your password",
        "Tap below to choose a new password. This link expires in an hour.",
        "Reset password",
        link,
      ),
    );
    if (!result.ok) {
      // Log for ourselves — but DON'T tell the user, to avoid revealing
      // whether this email has an account. This is the one place we
      // deliberately stay silent on failure.
      console.error(
        "Password reset email failed for a registered user:",
        result.error,
      );
    }
  }

  // Same message whether or not the email exists, or even if sending failed.
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
