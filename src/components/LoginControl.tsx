import React from "react";
import { getSession } from "@/lib/session";
import LoginLink from "./LoginLink";
import { UserBlock } from "./UserBlock";

export default async function LoginControl() {
  // TODO display user name?
  const { user } = await getSession();
  return user ? (
    <UserBlock user={user} />
  ) : (
    <div className="pr-2">
      <LoginLink />
    </div>
  );
}
