import { BlogVisibility, Role, User } from "@prisma/client";
import { BlogDTO } from "./blog-dto";
import * as friendService from "@/lib/service/friend.service";

export async function canUserSeeBlog(
  user: User | null,
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

export function canUserEditBlog(user: User | null, blog: BlogDTO): boolean {
  if (!user) return false;
  if (user.role === Role.ADMIN) return true;
  if (blog.author && blog.author.id === user.id) return true;
  return false;
}

export function canUserCreateBlog(user: User | null): boolean {
  return !!user;
}
