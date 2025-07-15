export abstract class EmailMessage {
  abstract getSubject(): string;
  abstract getText(): string;
  abstract getHtml(): string | Promise<string>;
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
