import { NextRequest, NextResponse } from "next/server";
import * as userService from "@/lib/service/user.service";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("query");

  if (typeof query !== "string") {
    return new Response("Query parameter is required", { status: 400 });
  }

  try {
    return NextResponse.json(await userService.findUsersByString(query));
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
