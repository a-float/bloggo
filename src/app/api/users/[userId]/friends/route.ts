import { unauthorized } from "next/navigation";
import { type NextRequest, NextResponse } from "next/server";
import * as friendService from "@/lib/service/friend.service";
import { getSession } from "@/lib/session";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const { user } = await getSession();
  if (!user || user.id !== userId) {
    return unauthorized();
  }

  const friends = await friendService.getFriendsForUser(user);

  return NextResponse.json(friends);
}
