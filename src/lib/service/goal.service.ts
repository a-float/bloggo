import "server-only";
import { Prisma, Role, FriendshipStatus, GoalVisibility } from "@prisma/client";
import prisma from "../prisma";
import { type UserDTO } from "@/data/user-dto.ts";
import { type TagWithCount } from "@/types/common";
import { getGoalDTO } from "@/data/goal-dto";

// Duplicated blog logic
function getGoalWhereForUser(user: UserDTO | null): Prisma.GoalWhereInput {
  if (!user) return { visibility: GoalVisibility.PUBLIC };
  if (user.role === Role.ADMIN) return {};
  return {
    OR: [
      { ownerId: user.id },
      { visibility: GoalVisibility.PUBLIC },
      {
        visibility: GoalVisibility.FRIENDS,
        owner: {
          OR: [
            {
              friends: {
                some: {
                  status: FriendshipStatus.ACCEPTED,
                  requesterId: user.id,
                },
              },
            },
            {
              friendOf: {
                some: {
                  status: FriendshipStatus.ACCEPTED,
                  recipientId: user.id,
                },
              },
            },
          ],
        },
      },
    ],
  };
}

export async function getGoalsForUser(user: UserDTO | null) {
  const goals = await prisma.goal.findMany({
    where: getGoalWhereForUser(user),
    include: {
      items: { orderBy: { createdAt: "desc" } },
      owner: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return goals.map((goal) => getGoalDTO(goal));
}

export async function getGoalById(id: number) {
  const goal = await prisma.goal.findUnique({
    where: { id },
    include: {
      items: { orderBy: { createdAt: "desc" } },
      owner: true,
    },
  });
  return goal ? getGoalDTO(goal) : null;
}

export async function getGoalTagCounts(
  user: UserDTO | null,
): Promise<TagWithCount[]> {
  const goals = await prisma.goal.findMany({
    where: getGoalWhereForUser(user),
    select: { tags: true },
  });
  const tagCounts = new Map<string, number>();
  goals.forEach((goal) => {
    goal.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export async function getTotalGoalProgress(goalId: number) {
  const result = await prisma.goalItem.aggregate({
    where: { goalId },
    _sum: { value: true },
    _count: { value: true },
    _max: { value: true },
  });
  return {
    sum: result._sum.value || 0,
    count: result._count.value || 0,
    max: result._max.value || 0,
  };
}
