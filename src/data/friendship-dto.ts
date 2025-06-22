import "server-only";
import { Prisma } from "@prisma/client";
import { getUserDTO } from "./user-dto.ts";

export function getFriendshipDTO(
  friendship: Prisma.FriendshipGetPayload<{
    include: { requester: true; recipient: true };
  }>
) {
  return {
    id: friendship.requesterId + "-" + friendship.recipientId,
    requester: getUserDTO(friendship.requester),
    recipient: getUserDTO(friendship.recipient),
    status: friendship.status,
    createdAt: friendship.createdAt.getTime(),
  };
}

export type FriendshipDTO = Awaited<ReturnType<typeof getFriendshipDTO>>;
