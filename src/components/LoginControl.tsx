import React from "react";
import getUser from "@/lib/getUser";
import SignOutButton from "./SignOutButton";
import LoginLink from "./LoginLink";

const defaultAvatarUrl =
  "https://img.daisyui.com/images/profile/demo/batperson@192.webp";

export default async function LoginControl() {
  const user = await getUser();
  return user ? (
    <div className="dropdown dropdown-end pr-2">
      <div
        tabIndex={0}
        role="button"
        className="avatar focus-within:[&>*]:shadow-lg "
      >
        <div className="w-8 rounded-full select-none">
          <img src={user.avatarUrl || defaultAvatarUrl} />
        </div>
      </div>
      <ul className="dropdown-content rounded-box overflow-hidden z-1 shadow-sm menu bg-base-200 w-34 mt-2 [&_li>*]:py-2 [&_li>*]:pl-4 p-0">
        {/* <li>
          <Link href="/settings">Settings</Link>
        </li> */}
        <li>
          <SignOutButton />
        </li>
      </ul>
    </div>
  ) : (
    <div className="pr-2">
      <LoginLink />
    </div>
  );
}
