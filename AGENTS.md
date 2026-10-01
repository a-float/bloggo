# Bloggo — AI Agent Reference

## Repo Info
- **Type**: Next.js 16 app (App Router), React 19, TypeScript
- **Auth**: NextAuth (Google OAuth + email magic link + password)
- **DB**: PostgreSQL via Prisma ORM
- **Blob storage**: Vercel Blob (prod) / local filesystem (dev: `public/blobs`)
- **Dev server**: `npm run dev` (port 5000)
- **Docker**: `docker-compose.yaml` provides PostgreSQL + Mailpit

## Key Architecture Patterns

### Server Actions (mutations)
All mutations live in `src/actions/*.action.ts` as `"use server"` functions. They:
1. Call `getSession()` to check auth
2. Validate input with Yup schemas
3. Use Prisma directly or via service layer
4. Return `ActionState` objects (`{ success, message, data?, errors? }`)
5. Call `revalidatePath()` after changes

### Service Layer (data fetching)
`src/lib/service/*.service.ts` — server-only functions wrapping Prisma queries.
- `blog.service.ts` — blog CRUD, visibility filtering, tag counts
- `user.service.ts` — user search
- `friend.service.ts` — friendship management
- `goal.service.ts` — goal tracking (separate from blogs)

### Access Control
`src/data/access.ts` — pure functions checking permissions:
- `canUserSeeBlog` — PUBLIC always, FRIENDS requires accepted friendship, PRIVATE requires ownership
- `canUserEditBlog` — owner or admin, must have verified email
- `canUserCreateBlog` — verified email required

### DTOs
`src/data/*-dto.ts` — transform Prisma models to safe objects. Note: `user-dto.ts.ts` has a double extension (typo).

### Session
`src/lib/session.ts` wraps `auth()` from `src/auth.ts`. Returns `{ user: null }` when not authenticated.

## File Layout
```
src/
  app/              Next.js App Router pages
    [slug]/         Dynamic blog routes
    blogs/          Blog list, create, edit
    goals/          Goal tracking pages
    auth/           Login, register, reset-password
    api/            API routes (users search, auth, cron)
  actions/          Server actions (mutations)
  components/       UI components (DaisyUI/Tailwind)
  lib/              Services, auth, session, blob, markdown
  data/             DTOs and access control
```

## Important Notes
- `prisma/schema.prisma` uses `@map` directives (DB column names differ from model names)
- Markdown rendering uses `micromark` with GFM; `trusted` flag allows dangerous HTML
- Image uploads: client compresses → `uploadFiles` action → Prisma Image record + blob storage
- `getSession()` returns `{ user: null }` not `null` when unauthenticated — check `.user`
- `user-dto.ts.ts` has a typo in filename (double `.ts`)
- Goals are a separate feature from blogs with similar visibility model
