"use server";

import { type UserDTO } from "@/data/user-dto.ts";
import { getSession } from "@/lib/session";
import * as friendService from "@/lib/service/friend.service";
import { FriendshipStatus } from "@prisma/client";
import { notFound, unauthorized } from "next/navigation";

type FriendshipResponse = {
  success: boolean;
  message?: string;
};

export async function createFriendship(
  friendId: UserDTO["id"]
): Promise<FriendshipResponse> {
  if (!friendId) {
    throw new Error("Invalid data");
  }
  const { user } = await getSession();
  if (!user) return unauthorized();
  if (user.id === friendId)
    return { success: false, message: "You cannot befriend yourself." };
  await friendService.createFriendship(user.id, friendId);
  return { success: true, message: "Friendship request sent." };
}

export async function updateFriendship(
  friendId: UserDTO["id"],
  status: FriendshipStatus
): Promise<FriendshipResponse> {
  if (!friendId || status === FriendshipStatus.PENDING) {
    throw new Error("Invalid data");
  }
  const { user } = await getSession();
  if (!user) return unauthorized();
  await friendService.updateFriendship(friendId, user.id, status);
  return { success: true, message: "Friendship updated." };
}

export async function deleteFriendship(
  friendId: UserDTO["id"]
): Promise<FriendshipResponse> {
  if (!friendId) {
    throw new Error("Invalid data");
  }
  const { user } = await getSession();
  if (!user) return notFound();
  await friendService.deleteFriendship(user.id, friendId);
  return { success: true, message: "Friendship deleted." };
}
