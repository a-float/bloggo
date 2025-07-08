import { Awaitable } from "next-auth";

export abstract class EmailMessage {
  abstract getSubject(): string;
  abstract getText(): string;
  abstract getHtml(): Awaitable<string>;
}

export type VerificationEmailMessageOptions = {
  url: string;
  validationCode?: string;
};

export abstract class VerificationEmailMessage extends EmailMessage {
  constructor(protected options: VerificationEmailMessageOptions) {
    super();
  }
  abstract getMaxAge(): number;
}
