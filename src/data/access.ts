import { BlogVisibility, Role } from "@prisma/client";
import * as friendService from "@/lib/service/friend.service";
import type { BlogDTO } from "./blog-dto";
import type { GoalDto } from "./goal-dto";
import type { UserDTO } from "./user-dto.ts";

export async function canUserSeeBlog(
  user: UserDTO | null,
  blog: BlogDTO,
): Promise<boolean> {
  if (blog.visibility === BlogVisibility.PUBLIC) return true;
  if (!user) return false;
  if (user.role === Role.ADMIN) return true;
  if (!blog.author) return false;
  if (user.id === blog.author.id) return true;
  if (
    blog.visibility === BlogVisibility.FRIENDS &&
    (await friendService.areUsersFriends(user, blog.author))
  ) {
    return true;
  }
  return false;
}

export function canUserEditBlog(user: UserDTO | null, blog: BlogDTO): boolean {
  if (!user?.hasVerifiedEmail) return false;
  if (user.role === Role.ADMIN) return true;
  if (blog.author && blog.author.id === user.id) return true;
  return false;
}

export function canUserCreateBlog(user: UserDTO | null): boolean {
  return !!user?.hasVerifiedEmail;
}

export function canUserCreateGoal(user: UserDTO | null): boolean {
  return !!user?.hasVerifiedEmail;
}

export function canUserCreatePublicGoal(user: UserDTO | null): boolean {
  return !!(user?.hasVerifiedEmail && user.role === Role.ADMIN);
}

// TODO support for friends' goals?
export function canUserSeeGoal(user: UserDTO | null, goal: GoalDto): boolean {
  if (goal.owner && goal.owner?.id === user?.id) return true;
  return false;
}

export function canUserEditGoal(user: UserDTO | null, goal: GoalDto): boolean {
  if (!user?.hasVerifiedEmail) return false;
  if (user.role === Role.ADMIN) return true;
  if (goal.owner && goal.owner.id === user.id) return true;
  return false;
}
