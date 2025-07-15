import { HttpEmailChannel } from "./channel/http-email.channel";
import { LocalEmailChannel } from "./channel/local-email.channel";

export function createEmailChannel() {
  if (process.env.NODE_ENV === "development") {
    return new LocalEmailChannel().init();
  }
  return new HttpEmailChannel();
}
