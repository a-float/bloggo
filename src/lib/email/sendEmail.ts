import { createTransport } from "nodemailer";
import Mail from "nodemailer/lib/mailer";

// EMAIL_SERVER_USER=resend
// EMAIL_SERVER_HOST=localhost
// EMAIL_SERVER_PORT=1025
// EMAIL_FROM=noreply@email.bloggo.com

// https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/nodemailer.ts
export async function sendEmail(options: {
  to: string;
  subject: string;
  text: Mail.Options["text"];
  html: Mail.Options["html"];
}) {
  const transport = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT!),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.AUTH_RESEND_KEY,
    },
  });
  const result = await transport.sendMail({
    from: process.env.EMAIL_FROM,
    ...options,
  });
  const rejected = result.rejected || [];
  const pending = result.pending || [];
  const failed = rejected.concat(pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email (${failed.join(", ")}) could not be sent`);
  }
}
