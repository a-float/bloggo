"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button
      className="btn btn-primary btn-sm"
      onClick={() => signOut().then(() => router.refresh())}
    >
      Sign out
    </button>
  );
}
