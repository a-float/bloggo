import { EmailChannel } from "../email.channel";
import { EmailMessage } from "../email.message";
import { Resend } from "resend";

export class HttpEmailChannel extends EmailChannel {
  // TODO group env in getConfig
  async send(recipient: string, message: EmailMessage) {
    const resend = new Resend(process.env.AUTH_RESEND_KEY);
    console.log("sending", message, message.getText(), recipient);
    const res = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: recipient,
      subject: message.getSubject(),
      text: message.getText(),
      html: await message.getHtml(),
    });
    console.log({ res });
  }
}
