import React from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import SignOutButton from "./SignOutButton";

export default async function LoginControl() {
  const session = await getServerSession();
  return session?.user ? (
    <div className="flex items-center gap-2">
      <p className="text-sm">Signed in as {session.user.name}</p>
      <SignOutButton />
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <p className="text-sm">Not signed in</p>
      <Link href="/auth/login" className="btn btn-primary btn-sm">
        Sign in
      </Link>
    </div>
  );
}
