import { VerificationTokenType } from "@prisma/client";

export const emailTypeMapper = {
  encode(type: VerificationTokenType, email: string) {
    return `${type}:${email}`;
  },

  decode(identifier: string) {
    const delim = identifier.indexOf(":");
    if (delim === -1) throw Error(`Invalid identifier: ${identifier}`);
    const normalizedType = identifier.slice(0, delim);
    const email = identifier.slice(delim + 1);

    const type = normalizedType.toUpperCase();

    switch (type) {
      case VerificationTokenType.VERIFY_EMAIL:
      case VerificationTokenType.LOGIN:
      case VerificationTokenType.REST_PASSWORD:
        return { type, email };
      default:
        throw Error(`Invalid identifier: ${identifier}`);
    }
  },
};
