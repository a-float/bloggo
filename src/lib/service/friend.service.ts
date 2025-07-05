import "server-only";
import { FriendshipStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { UserDTO } from "@/data/user-dto.ts";
import { getFriendshipDTO } from "@/data/friendship-dto";

export async function areUsersFriends(
  userA: Pick<UserDTO, "id">,
  userB: Pick<UserDTO, "id">
) {
  const friendship = await prisma.friendship.findFirst({
    where: {
      status: FriendshipStatus.ACCEPTED,
      OR: [
        { recipientId: userA.id, requesterId: userB.id },
        { recipientId: userB.id, requesterId: userA.id },
      ],
    },
  });
  return !!friendship;
}

export async function createFriendship(
  requesterId: UserDTO["id"],
  recipientId: UserDTO["id"]
) {
  try {
    await prisma.friendship.create({
      data: {
        requester: { connect: { id: requesterId } },
        recipient: { connect: { id: recipientId } },
        status: FriendshipStatus.PENDING,
      },
    });
  } catch (error) {
    console.error("Error creating friendship:", error);
    if (error instanceof Error && error.message.includes("P2002")) {
      throw new Error("Friendship invite already exists");
    }
    throw new Error("Something went wrong while creating the friend invite");
  }
}

export async function updateFriendship(
  requesterId: UserDTO["id"],
  recipientId: UserDTO["id"],
  status: FriendshipStatus
) {
  try {
    await prisma.friendship.update({
      where: {
        requesterId_recipientId: {
          requesterId,
          recipientId,
        },
        status: FriendshipStatus.PENDING,
      },
      data: { status },
    });
  } catch (error) {
    console.error("Error updating friendship:", error);
    if (error instanceof Error && error.message.includes("P2025")) {
      throw new Error("Friendship doesn't exist");
    }
    throw new Error("Something went wrong while accepting the friend invite");
  }
}

export async function deleteFriendship(
  friendId1: UserDTO["id"],
  friendId2: UserDTO["id"]
) {
  try {
    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { requesterId: friendId1, recipientId: friendId2 },
          { requesterId: friendId2, recipientId: friendId1 },
        ],
      },
    });
  } catch (error) {
    console.error("Error deleting friendship:", error);
    if (error instanceof Error && error.message.includes("P2025")) {
      throw new Error("Friendship doesn't exist");
    }
    throw new Error("Something went wrong while deleting the friend invite");
  }
}

export async function getFriendsForUser(
  user: UserDTO,
  status?: FriendshipStatus
) {
  if (!user) return [];
  const friendships = await prisma.friendship.findMany({
    where: {
      status,
      OR: [{ requesterId: user.id }, { recipientId: user.id }],
    },
    include: {
      requester: true,
      recipient: true,
    },
  });

  return friendships.map((friendships) => getFriendshipDTO(friendships));
}
