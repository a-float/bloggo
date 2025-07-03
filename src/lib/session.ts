import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function getSession(): Promise<Session | { user: null }> {
  const session = await getServerSession(authOptions);
  if (session) return session;
  return { user: null };
}
