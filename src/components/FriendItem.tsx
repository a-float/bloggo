import {
  deleteFriendship,
  updateFriendship,
} from "@/actions/friendship.action";
import { FriendshipDTO } from "@/data/friendship-dto";
import { UserDTO } from "@/data/user-dto.ts";
import { FriendshipStatus } from "@prisma/client";
import { FaCheck, FaXmark } from "react-icons/fa6";
import AvatarWithFallback from "./AvatarWithFallback";

function removeFriend(friendId: UserDTO["id"]) {
  return deleteFriendship(friendId);
}

function acceptFriend(friendId: UserDTO["id"]) {
  return updateFriendship(friendId, FriendshipStatus.ACCEPTED);
}

export default function FriendItem(props: {
  user: UserDTO;
  friendship: FriendshipDTO;
  afterMutate?: () => void;
}) {
  const { user, friendship, afterMutate: onMutate } = props;
  const isRequester = user?.email === friendship.requester.email;
  const otherUser = isRequester ? friendship.recipient : friendship.requester;

  return (
    <li className="list-row flex gap-3 px-2 py-2 items-center">
      <div className="size-8 rounded-full overflow-hidden">
        <AvatarWithFallback src={otherUser.image} name={otherUser.email} />
      </div>
      {friendship.status === FriendshipStatus.ACCEPTED && (
        <>
          <span>{otherUser.name}</span>
          <button
            className="btn btn-xs btn-error btn-soft ml-auto"
            title="Remove friend"
            onClick={() => removeFriend(otherUser.id).then(() => onMutate?.())}
          >
            <FaXmark />
          </button>
        </>
      )}
      {friendship.status === FriendshipStatus.PENDING && isRequester && (
        <>
          <div className="flex flex-col">
            <span className="text-xs text-base-content/70 tracking-wide">
              You invited
            </span>
            <span>{otherUser.name}</span>
          </div>
          <button
            className="btn btn-xs btn-soft btn-error ml-auto"
            title="Cancel invitation"
            onClick={() => removeFriend(otherUser.id).then(() => onMutate?.())}
          >
            <FaXmark />
          </button>
        </>
      )}

      {friendship.status === FriendshipStatus.PENDING && !isRequester && (
        <>
          <div className="flex flex-col">
            <span className="text-xs text-base-content/70 tracking-wide">
              Invite from
            </span>
            <span>{otherUser.name}</span>
          </div>
          <div className="flex gap-2 ml-auto">
            <button
              className="btn btn-xs btn-soft btn-success"
              title="Accept invitiation"
              onClick={() =>
                acceptFriend(otherUser.id).then(() => onMutate?.())
              }
            >
              <FaCheck />
            </button>
            <button
              className="btn btn-xs btn-soft btn-error"
              title="Decline invitation"
              onClick={() =>
                removeFriend(otherUser.id).then(() => onMutate?.())
              }
            >
              <FaXmark />
            </button>
          </div>
        </>
      )}
    </li>
  );
}
