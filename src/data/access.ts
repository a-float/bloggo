import { BlogVisibility, Role, User } from "@prisma/client";
import { BlogDTO } from "./blog-dto";

export function canUserSeeBlog(user: User | null, blog: BlogDTO): boolean {
  if (blog.visibility === BlogVisibility.PUBLIC) return true;
  if (user?.role === Role.ADMIN) return true;
  if (user && user.id === blog.author?.id) return true;
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
