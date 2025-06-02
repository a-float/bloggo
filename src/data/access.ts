import { User } from "@prisma/client";
import { BlogDTO } from "./blog-dto";

export function canUserSeeBlog(user: User | null, blog: BlogDTO): boolean {
  if (blog.isPublic) return true;
  if (user?.isAdmin) return true;
  if (user && user.id === blog.author?.id) return true;
  return false;
}

export function canUserEditBlog(user: User | null, blog: BlogDTO): boolean {
  if (!user) return false;
  if (user.isAdmin) return true;
  if (blog.author && blog.author.id === user.id) return true;
  return false;
}

export function canUserCreateBlog(user: User | null): boolean {
  return !!user;
}
