import { User } from "@prisma/client";
import { BlogDTO } from "./blog-dto";

export function canUserEditBlog(user: User | null, blog: BlogDTO): boolean {
  if (!user) return false;
  if (user.isAdmin) return true;
  if (blog.author && blog.author.id === user.id) return true;
  return false;
}

export function canUserCreateBlog(user: User | null): boolean {
  return !!user;
}
