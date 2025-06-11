import getUser from "@/lib/getUser";
import { unauthorized } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import * as friendService from "@/lib/service/friend.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const user = await getUser();
  if (!user || user.id !== parseInt(userId)) {
    return unauthorized();
  }

  const friends = await friendService.getFriendsForUser(user);

  return NextResponse.json(friends);
}
