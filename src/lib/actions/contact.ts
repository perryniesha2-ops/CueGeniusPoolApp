"use server";

import { redirect } from "next/navigation";
import { sendEmail } from "@/lib/email";

export async function sendContactMessage(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  // Basic validation — all three required.
  if (!name || !email || !message) {
    redirect(
      "/contact?error=" + encodeURIComponent("Please fill in all fields."),
    );
  }

  // Simple email sanity check.
  if (!email.includes("@") || !email.includes(".")) {
    redirect(
      "/contact?error=" + encodeURIComponent("Please enter a valid email."),
    );
  }

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6">
      <h2 style="margin:0 0 12px">New contact message — CueGenius</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap;background:#f4f4f4;padding:12px;border-radius:8px">${escapeHtml(message)}</p>
    </div>`;

  const result = await sendEmail(
    "cuegenius@synthqatech.com", // where contact messages go (swap to cuegenius domain later)
    `Contact form: ${name}`,
    html,
  );

  if (!result.ok) {
    redirect(
      "/contact?error=" +
        encodeURIComponent(
          "Something went wrong sending your message. Please try again.",
        ),
    );
  }

  redirect("/contact?sent=1");
}

// Escape user input so it can't inject HTML into the email.
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
