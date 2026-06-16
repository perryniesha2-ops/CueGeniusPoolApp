import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendEmail(to: string, subject: string, html: string) {
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to,
    subject,
    html,
  });
  if (error) console.error("Resend error:", error);
}

// A simple branded template wrapper.
export function emailLayout(
  heading: string,
  body: string,
  buttonText: string,
  buttonUrl: string,
) {
  return `
  <div style="background:#0a0d18;padding:40px 0;font-family:Arial,sans-serif">
    <div style="max-width:480px;margin:0 auto;background:#0c0f1a;border:1px solid rgba(120,150,255,0.18);border-radius:16px;padding:32px">
      <div style="font-size:28px;font-weight:bold;color:#eaf0f6;letter-spacing:1px">CUEGENIUS.<span style="color:#4d6bff">.</span></div>
      <h1 style="color:#eaf0f6;font-size:20px;margin:20px 0 8px">${heading}</h1>
      <p style="color:#7c869b;font-size:15px;line-height:1.6">${body}</p>
      <a href="${buttonUrl}" style="display:inline-block;margin-top:20px;background:#2323ff;color:#fff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:bold">${buttonText}</a>
      <p style="color:#5a6275;font-size:12px;margin-top:24px">If you didn't request this, you can ignore this email.</p>
    </div>
  </div>`;
}
