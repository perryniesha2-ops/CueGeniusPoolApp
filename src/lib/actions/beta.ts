"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function checkBetaPassword(formData: FormData) {
  const entered = formData.get("password") as string;
  if (entered !== process.env.BETA_PASSWORD) {
    redirect("/beta?error=" + encodeURIComponent("Incorrect password"));
  }
  // Mark this browser as beta-approved for 30 days.
  (await cookies()).set("beta_access", "granted", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  redirect("/login");
}
