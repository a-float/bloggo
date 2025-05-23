"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button className="btn btn-primary btn-sm" onClick={() => signOut()}>
      Sign out
    </button>
  );
}
