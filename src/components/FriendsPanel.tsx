"use client";

import { UserDTO } from "@/data/user-dto.ts";
import React from "react";
import AsyncSelect from "react-select/async";
import { clearStyleProxy } from "./TagSelect";
import { FriendshipDTO } from "@/data/friendship-dto";
import { FriendshipStatus } from "@prisma/client";
import {
  createFriendship,
  updateFriendship,
  deleteFriendship,
} from "@/actions/friendship.action";

type UserOption = {
  value: number;
  label: string;
  data: UserDTO;
};

function inviteFriend(friendId: number) {
  return createFriendship(friendId);
}

function removeFriend(friendId: number) {
  return deleteFriendship(friendId);
}

function acceptFriend(friendId: number) {
  return updateFriendship(friendId, FriendshipStatus.ACCEPTED);
}

const useFriends = (userId: number) => {
  const [friendships, setFriendships] = React.useState<FriendshipDTO[]>([]);

  const fetchFriends = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/friends`);
      if (response.ok) {
        const data: FriendshipDTO[] = await response.json();
        setFriendships(data);
      } else {
        console.error("Failed to fetch friends");
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  React.useEffect(() => {
    fetchFriends();
  }, []);

  return { friendships, setFriendships, refetch: fetchFriends };
};

function FriendItem(props: {
  user: UserDTO;
  friendship: FriendshipDTO;
  afterMutate?: () => void;
}) {
  const { user, friendship, afterMutate: onMutate } = props;
  const isRequester = user?.email === friendship.requester.email;
  const otherUser = isRequester ? friendship.recipient : friendship.requester;

  return (
    <div className="p-2 mt-4">
      {friendship.status === FriendshipStatus.ACCEPTED && (
        <div className="flex justify-between gap-2">
          <span>Friend</span>
          <span>{otherUser.name}</span>
          <button
            className="btn btn-xs btn-error"
            onClick={() => removeFriend(otherUser.id).then(() => onMutate?.())}
          >
            Remove
          </button>
        </div>
      )}

      {friendship.status === FriendshipStatus.PENDING && isRequester && (
        <div className="flex gap-2">
          <span>Invited</span>
          <span>{otherUser.name}</span>
        </div>
      )}

      {friendship.status === FriendshipStatus.PENDING && !isRequester && (
        <div className="flex justify-between gap-2">
          <span>Invitation</span>
          <span>{otherUser.name}</span>
          <div className="flex gap-2">
            <button
              className="btn btn-xs btn-success"
              onClick={() =>
                acceptFriend(otherUser.id).then(() => onMutate?.())
              }
            >
              Accept
            </button>
            <button
              className="btn btn-xs btn-error"
              onClick={() =>
                removeFriend(otherUser.id).then(() => onMutate?.())
              }
            >
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function FriendPanel(props: { user: UserDTO }) {
  const id = React.useId();
  const { friendships, refetch } = useFriends(props.user.id);
  const promiseOptions = async (query: string): Promise<UserOption[]> => {
    try {
      const response = await fetch(
        `/api/users?query=${encodeURIComponent(query)}`
      );
      if (response.ok) {
        const users: UserDTO[] = await response.json();
        const idsToIgnore = new Set(
          friendships.flatMap((f) => [f.requester.id, f.recipient.id])
        );
        return users.flatMap((user) => {
          if (!user) return [];
          if (idsToIgnore.has(user.id)) return [];
          return {
            value: user.id,
            label: user.email,
            data: user,
          };
        });
      }
      return [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const pendingFriendships = friendships.filter(
    (friendship) => friendship.status === FriendshipStatus.PENDING
  );
  const acceptedFriendships = friendships.filter(
    (friendship) => friendship.status === FriendshipStatus.ACCEPTED
  );

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Friends</h2>
      <AsyncSelect
        className="tag-select__container"
        classNamePrefix="tag-select"
        styles={clearStyleProxy}
        instanceId={id}
        value={null}
        onChange={(selectedOption) => {
          if (!selectedOption) return;
          inviteFriend(selectedOption.data.id).then(refetch);
        }}
        formatOptionLabel={(option: UserOption) => (
          <div className="flex justify-between">
            <span>{option.label}</span>
            <button className="btn btn-xs btn-success">Add</button>
          </div>
        )}
        loadOptions={promiseOptions}
      />
      {pendingFriendships.length > 0 && (
        <section>
          <h3 className="text-xl mt-4">Friend requests</h3>
          <div className="mt-4">
            {pendingFriendships.map((friendship) => (
              <FriendItem
                key={friendship.id}
                user={props.user}
                friendship={friendship}
                afterMutate={refetch}
              />
            ))}
          </div>
        </section>
      )}
      <section>
        <h3 className="text-xl mt-4">Your friends</h3>
        {acceptedFriendships.length > 0 ? (
          <div className="mt-4">
            {acceptedFriendships.map((friendship) => (
              <FriendItem
                key={friendship.id}
                user={props.user}
                friendship={friendship}
                afterMutate={refetch}
              />
            ))}
          </div>
        ) : (
          <p>You don&apos;t have any friends yet. Invite some!</p>
        )}
      </section>
    </div>
  );
}
