import React from "react";
import { Drawer, DrawerToggle } from "./Drawer";
import SignOutButton from "./SignOutButton";
import getUser from "@/lib/getUser";
import { FriendPanel } from "./FriendsPanel";

const defaultAvatarUrl =
  "https://img.daisyui.com/images/profile/demo/batperson@192.webp";

export function UserBlock(props: {
  user: NonNullable<Awaited<ReturnType<typeof getUser>>>;
}) {
  const id = React.useId();

  return (
    <Drawer
      drawerId={id}
      drawerContent={<FriendPanel user={props.user} />}
      className="w-auto"
    >
      <div className="dropdown dropdown-end pr-2">
        <div
          tabIndex={0}
          role="button"
          className="avatar focus-within:[&>*]:shadow-lg "
        >
          <div className="w-8 rounded-full select-none">
            <img
              src={props.user.avatarUrl || defaultAvatarUrl}
              alt="User avatar"
            />
          </div>
        </div>
        <ul className="dropdown-content rounded-box overflow-hidden z-1 shadow-sm menu bg-base-200 w-34 mt-2 [&_li>*]:py-2 [&_li>*]:pl-4 p-0">
          <li>
            <DrawerToggle drawerId={id}>Friends</DrawerToggle>
          </li>
          <li>
            <SignOutButton />
          </li>
        </ul>
      </div>
    </Drawer>
  );
}
