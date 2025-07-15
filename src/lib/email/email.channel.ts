import { EmailMessage } from "./email.message";

export abstract class EmailChannel {
  abstract send(recipient: string, message: EmailMessage): Promise<void>;
}
