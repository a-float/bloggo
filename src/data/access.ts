import { BlogVisibility, Role } from "@prisma/client";
import { type BlogDTO } from "./blog-dto";
import { type UserDTO } from "./user-dto.ts";
import * as friendService from "@/lib/service/friend.service";

export async function canUserSeeBlog(
  user: UserDTO | null,
  blog: BlogDTO
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
  if (!user || !user.hasVerifiedEmail) return false;
  if (user.role === Role.ADMIN) return true;
  if (blog.author && blog.author.id === user.id) return true;
  return false;
}

export function canUserCreateBlog(user: UserDTO | null): boolean {
  return !!(user && user.hasVerifiedEmail);
}
