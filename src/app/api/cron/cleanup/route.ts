import { createBlobStorage } from "@/lib/blob";
import prisma from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (
    process.env.NODE_ENV !== "development" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const orphanedImages = await prisma.image.findMany({
    where: { blogId: null },
  });

  const storage = createBlobStorage();
  await Promise.all(
    orphanedImages.map(async (image) => {
      storage.remove(image.url);
    })
  );

  await prisma.image.deleteMany({
    where: { blogId: null },
  });

  return Response.json({ success: true, count: orphanedImages.length });
}
