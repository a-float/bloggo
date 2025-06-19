"use client";

import { signIn } from "next-auth/react";

export default function LoginLink() {
  return (
    <a
      href="/auth/login"
      className="btn btn-ghost btn-sm"
      onClick={(e) => {
        if (location.pathname === "/auth/login") return;
        e.preventDefault();
        signIn(undefined, { callbackUrl: location.pathname, redirect: true });
      }}
    >
      Sign In
    </a>
  );
}
