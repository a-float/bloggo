"use server";

import getUser from "@/lib/getUser";
import * as friendService from "@/lib/service/friend.service";
import { FriendshipStatus } from "@prisma/client";
import { notFound, unauthorized } from "next/navigation";

type FriendshipResponse = {
  success: boolean;
  message?: string;
};

export async function createFriendship(
  friendId: number
): Promise<FriendshipResponse> {
  if (!friendId) {
    throw new Error("Invalid data");
  }
  const user = await getUser();
  if (!user) return unauthorized();
  if (user.id === friendId)
    return { success: false, message: "You cannot befriend yourself." };
  await friendService.createFriendship(user.id, friendId);
  return { success: true, message: "Friendship request sent." };
}

export async function updateFriendship(
  friendId: number,
  status: FriendshipStatus
): Promise<FriendshipResponse> {
  if (!friendId || status === FriendshipStatus.PENDING) {
    throw new Error("Invalid data");
  }
  const user = await getUser();
  if (!user) return unauthorized();
  await friendService.updateFriendship(friendId, user.id, status);
  return { success: true, message: "Friendship updated." };
}

export async function deleteFriendship(
  friendId: number
): Promise<FriendshipResponse> {
  if (!friendId) {
    throw new Error("Invalid data");
  }
  const user = await getUser();
  if (!user) return notFound();
  await friendService.deleteFriendship(user.id, friendId);
  return { success: true, message: "Friendship deleted." };
}
