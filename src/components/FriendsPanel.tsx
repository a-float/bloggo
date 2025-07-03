"use client";

import { UserDTO } from "@/data/user-dto.ts";
import React from "react";
import Select from "react-select";
import { clearStyleProxy } from "./TagSelect";
import { FriendshipDTO } from "@/data/friendship-dto";
import { FriendshipStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { createFriendship } from "@/actions/friendship.action";
import FriendItem from "./FriendItem";

const USER_SEARCH_DEBOUNCE_MS = 100;

function inviteFriend(friendId: UserDTO["id"]) {
  return createFriendship(friendId);
}

const getPendingFriendshipSorter =
  (userId: UserDTO["id"]) => (a: FriendshipDTO, b: FriendshipDTO) => {
    // Sort so that request directed at the current user are at the top
    if (a.recipient.id === userId && b.recipient.id !== userId) return -1;
    if (a.recipient.id !== userId && b.recipient.id === userId) return 1;
    return b.createdAt - a.createdAt;
  };

export function FriendPanel(props: {
  user: UserDTO;
  friends: FriendshipDTO[];
}) {
  const id = React.useId();
  const [query, setQuery] = React.useState("");
  const [debouncedQuery] = useDebounceValue(query, USER_SEARCH_DEBOUNCE_MS);

  const friendshipsQuery = useQuery({
    queryKey: ["friends", props.user.id],
    refetchOnWindowFocus: false,
    initialData: props.friends,
    staleTime: 60 * 1000, // 1 minute
    queryFn: async () => {
      const response = await fetch(`/api/users/${props.user.id}/friends`);
      if (!response.ok) throw new Error("Failed to fetch friends");
      return response.json() as Promise<FriendshipDTO[]>;
    },
  });

  const usersQuery = useQuery({
    queryKey: ["users", debouncedQuery] as const,
    enabled: !!debouncedQuery,
    refetchOnWindowFocus: false,
    staleTime: 60 * 1000, // 1 minute
    queryFn: async (ctx) => {
      const q = ctx.queryKey[1];
      const response = await fetch(`/api/users?query=${encodeURIComponent(q)}`);
      if (!response.ok) throw new Error("Failed to fetch users");
      return (await response.json()) as UserDTO[];
    },
  });

  const nonInvitiableUserIds = new Set(
    (friendshipsQuery.data ?? [])
      .flatMap((f) => [f.requester.id, f.recipient.id])
      .concat(props.user.id)
  );
  const options = (usersQuery?.data || []).filter(
    (user) => !nonInvitiableUserIds.has(user.id)
  );
  const pendingFriendships = friendshipsQuery.data?.filter(
    (friendship) => friendship.status === FriendshipStatus.PENDING
  );
  const acceptedFriendships = friendshipsQuery.data?.filter(
    (friendship) => friendship.status === FriendshipStatus.ACCEPTED
  );

  return (
    <div className="p-4 flex flex-col gap-3">
      <h2 className="text-2xl">Friends</h2>
      <p className="text-sm opacity-60">
        Here you can view and manage your friends or invite new ones.
      </p>
      <fieldset className="fieldset">
        <Select
          className="tag-select__container"
          classNamePrefix="tag-select"
          placeholder="Find a friend..."
          noOptionsMessage={({ inputValue }) =>
            inputValue
              ? `No users matching "${inputValue}" found`
              : "Start typing to find users..."
          }
          styles={clearStyleProxy}
          instanceId={id}
          options={options.map((user) => ({
            value: user.id,
            label: user.email,
            data: user,
          }))}
          value={null}
          onChange={(selectedOption) => {
            if (!selectedOption) return;
            inviteFriend(selectedOption.data.id).then(() =>
              friendshipsQuery.refetch()
            );
          }}
          isLoading={
            !!query && (usersQuery.isLoading || query !== debouncedQuery)
          }
          onInputChange={(inputValue) => setQuery(inputValue)}
          formatOptionLabel={(option) => (
            <div className="flex justify-between">
              <span>{option?.label}</span>
              <button className="btn btn-xs btn-success btn-soft">Add</button>
            </div>
          )}
        />
      </fieldset>
      {!!pendingFriendships?.length && (
        <section className="">
          <h3 className="text-xl mb-3">Friend requests</h3>
          <ul className="list">
            {pendingFriendships
              .sort(getPendingFriendshipSorter(props.user.id))
              .map((friendship) => (
                <FriendItem
                  key={friendship.id}
                  user={props.user}
                  friendship={friendship}
                  afterMutate={friendshipsQuery.refetch}
                />
              ))}
          </ul>
          <div className="divider my-0 mt-2" />
        </section>
      )}
      <section>
        <h3 className="text-xl mb-3">Your friends</h3>
        {!!acceptedFriendships?.length ? (
          <ul className="list">
            {acceptedFriendships.map((friendship) => (
              <FriendItem
                key={friendship.id}
                user={props.user}
                friendship={friendship}
                afterMutate={friendshipsQuery.refetch}
              />
            ))}
          </ul>
        ) : (
          <p>You don&apos;t have any friends yet</p>
        )}
      </section>
    </div>
  );
}
