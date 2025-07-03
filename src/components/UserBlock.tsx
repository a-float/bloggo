import { Drawer, DrawerToggle } from "./Drawer";
import SignOutButton from "./SignOutButton";
import { type UserDTO } from "@/data/user-dto.ts";
import { FriendPanel } from "./FriendsPanel";
import QueryProvider from "@/components/QueryProvider";
import * as friendService from "@/lib/service/friend.service";
import AvatarWithFallback from "./AvatarWithFallback";

export async function UserBlock(props: { user: UserDTO }) {
  const drawerId = "friend-panel-drawer";
  const friends = await friendService.getFriendsForUser(props.user);
  const pendingFriendRequests = friends.filter(
    (f) => f.recipient.id === props.user.id && f.status === "PENDING"
  ).length;

  const friendNotificationIndicator =
    pendingFriendRequests > 0 ? (
      <span className="indicator-item badge badge-secondary badge-xs px-1">
        {pendingFriendRequests}
      </span>
    ) : null;

  return (
    <Drawer
      drawerId={drawerId}
      drawerContent={
        <QueryProvider>
          <FriendPanel user={props.user} friends={friends} />
        </QueryProvider>
      }
      className="w-auto"
    >
      <div className="dropdown dropdown-end pr-2">
        <div
          tabIndex={0}
          role="button"
          className="avatar indicator focus-within:[&>*]:shadow-lg "
        >
          {friendNotificationIndicator}
          <div className="w-6 md:w-8 rounded-full select-none">
            <AvatarWithFallback
              src={props.user.image}
              name={props.user.email}
            />
          </div>
        </div>
        <ul className="dropdown-content rounded-box overflow-hidden z-1 shadow-sm menu bg-base-200 w-34 mt-2 [&_li>*]:py-2 [&_li>*]:pl-4 p-0">
          <li>
            <DrawerToggle drawerId={drawerId}>
              Friends
              {friendNotificationIndicator}
            </DrawerToggle>
          </li>
          <li>
            <SignOutButton />
          </li>
        </ul>
      </div>
    </Drawer>
  );
}
