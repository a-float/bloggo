import React from "react";
import getUser from "@/lib/getUser";
import LoginLink from "./LoginLink";
import { UserBlock } from "./UserBlock";

export default async function LoginControl() {
  const user = await getUser();
  return user ? (
    <UserBlock user={user} />
  ) : (
    <div className="pr-2">
      <LoginLink />
    </div>
  );
}
