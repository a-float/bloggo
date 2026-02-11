import "server-only";
import { Prisma, Role, FriendshipStatus, GoalVisibility } from "@prisma/client";
import prisma from "../prisma";
import { type UserDTO } from "@/data/user-dto.ts";
import { type TagWithCount } from "@/types/common";
import { getGoalDTO, GoalDto } from "@/data/goal-dto";
import { Asul } from "next/font/google";
import { revalidatePath } from "next/cache";

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

export async function getTotalGoalProgress(goal: Pick<GoalDto, "id">) {
  const result = await prisma.goalItem.aggregate({
    where: { goalId: goal.id },
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

export async function isGoalCompleted(
  goal: Pick<GoalDto, "id" | "type" | "target">,
) {
  const progress = await getTotalGoalProgress(goal);
  switch (goal.type) {
    case "COUNT":
      return progress.count >= goal.target;
    case "SUM":
      return progress.sum >= goal.target;
    case "MAX":
      return progress.max >= goal.target;
  }
}

export async function markGoalAsCompleted(goalId: number) {
  await prisma.goal.update({
    where: { id: goalId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
}

export async function markGoalAsCompletedIfNeeded(
  goal: Pick<GoalDto, "id" | "type" | "target" | "status">,
): Promise<boolean> {
  if (goal.status === "COMPLETED") return false;

  if (await isGoalCompleted(goal)) {
    await markGoalAsCompleted(goal.id);
    revalidatePath("/goals");
    revalidatePath(`/goals/${goal.id}`);
    return true;
  }

  return false;
}
