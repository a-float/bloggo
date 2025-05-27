import React from "react";
import { getServerSession } from "next-auth";
import SignOutButton from "./SignOutButton";
import LoginLink from "./LoginLink";

export default async function LoginControl() {
  const session = await getServerSession();
  return session?.user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm">Signed in as {session.user.name}</span>
      <SignOutButton />
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <span className="text-sm">Not signed in</span>
      <LoginLink />
    </div>
  );
}
