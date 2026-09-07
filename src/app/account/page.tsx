import { unauthorized } from "next/navigation";
import { getSession } from "@/lib/session";
import Account from "./Account";

export default async function AccountPage() {
  const { user } = await getSession();
  if (!user) unauthorized();

  return <Account user={user} />;
}
