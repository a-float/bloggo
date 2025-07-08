import { VerificationTokenType } from "@prisma/client";
import {
  type VerificationEmailMessageOptions,
  type VerificationEmailMessage,
} from "./message/email.message";
import { LoginMessage } from "./message/login.message";
import { ResetPasswordMessage } from "./message/reset-password.message";
import { VerifyEmailMessage } from "./message/verify-email.message";

export function createVerificationEmailMessage(
  type: VerificationTokenType,
  options: VerificationEmailMessageOptions
): VerificationEmailMessage {
  switch (type) {
    case VerificationTokenType.LOGIN:
      return new LoginMessage(options);

    case VerificationTokenType.VERIFY_EMAIL:
      return new VerifyEmailMessage(options);

    case VerificationTokenType.REST_PASSWORD:
      return new ResetPasswordMessage(options);
  }
}
