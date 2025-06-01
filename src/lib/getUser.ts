import { getServerSession } from "next-auth";
import prisma from "./prisma";

export default async function getUser() {
  const session = await getServerSession();
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({ where: { email: session.user.email } });
}
