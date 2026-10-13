import { NextRequest } from "next/server";

import { proxyToRails } from "@/lib/api/proxy";

export async function POST(request: NextRequest) {
  const body = await request.text();

  return proxyToRails(request, "/fishing_trips", {
    method: "POST",
    body,
  });
}
