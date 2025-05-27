"use client";

import { signIn } from "next-auth/react";

export default function LoginLink() {
  return (
    <a
      href="/auth/login"
      className="btn btn-primary btn-sm"
      onClick={(e) => {
        e.preventDefault();
        signIn(undefined, { callbackUrl: location.pathname, redirect: true });
      }}
    >
      Sign In
    </a>
  );
}
