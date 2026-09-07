import type { Session } from "next-auth";
import { auth } from "@/auth";

export async function getSession(): Promise<Session | { user: null }> {
  const session = await auth();
  if (session) return session;
  return { user: null };
}
