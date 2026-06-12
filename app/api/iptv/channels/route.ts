import { NextResponse } from "next/server";
import { getChannelsWithHash } from "./shared";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "universal";

  const { channels, hash } = getChannelsWithHash(type);

  return NextResponse.json(channels, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "X-Channels-Hash": hash,
    },
  });
}
