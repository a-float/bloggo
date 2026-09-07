import { type DefaultSession } from "next-auth";
import { type UserDTO } from "@/data/user-dto.ts";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: UserDTO | null;
  }
}
