import { createTransport, Transporter } from "nodemailer";
import { EmailChannel } from "../email.channel";
import { EmailMessage } from "../email.message";

export class LocalEmailChannel extends EmailChannel {
  transport: Transporter | null = null;

  init() {
    this.transport = createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: parseInt(process.env.EMAIL_SERVER_PORT!),
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.AUTH_RESEND_KEY,
      },
    });
    return this;
  }

  async send(recipient: string, message: EmailMessage) {
    if (!this.transport) {
      throw new Error("LocalEmailChannel has not been initialized");
    }
    const result = await this.transport.sendMail({
      from: process.env.EMAIL_FROM,
      to: recipient,
      subject: message.getSubject(),
      text: message.getText(),
      html: await message.getHtml(),
    });

    // https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/nodemailer.ts
    const rejected = result.rejected || [];
    const pending = result.pending || [];
    const failed = rejected.concat(pending).filter(Boolean);
    if (failed.length) {
      throw new Error(`Email (${failed.join(", ")}) could not be sent`);
    }
  }
}
