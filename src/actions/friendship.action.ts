"use server";

import getUser from "@/lib/getUser";
import * as friendService from "@/lib/service/friend.service";
import { FriendshipStatus } from "@prisma/client";
import { notFound, unauthorized } from "next/navigation";

export async function createFriendship(friendId: number): Promise<void> {
  if (!friendId) {
    throw new Error("Invalid data");
  }
  const user = await getUser();
  console.log(
    "creating friendship for user:",
    user?.id,
    "with friendId:",
    friendId
  );
  if (!user) return unauthorized();
  await friendService.createFriendship(user.id, friendId);
}

export async function updateFriendship(
  friendId: number,
  status: FriendshipStatus
): Promise<void> {
  if (!friendId || status === FriendshipStatus.PENDING) {
    throw new Error("Invalid data");
  }
  const user = await getUser();
  if (!user) return unauthorized();
  await friendService.updateFriendship(friendId, user.id, status);
}

export async function deleteFriendship(friendId: number): Promise<void> {
  if (!friendId) {
    throw new Error("Invalid data");
  }
  const user = await getUser();
  if (!user) return notFound();
  await friendService.deleteFriendship(user.id, friendId);
}
