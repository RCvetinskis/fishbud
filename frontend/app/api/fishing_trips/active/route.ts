import { NextRequest } from "next/server";

import { proxyToRails } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  const body = await request.text();

  return proxyToRails(request, "/fishing_trips/active", {
    method: "GET",
    body,
  });
}
