import { NextRequest } from "next/server";
import { proxyToRails } from "@/lib/api/proxy";

export async function statisticsProxy(request: NextRequest, endpoint: string) {
  const scope = request.nextUrl.searchParams.get("scope") ?? "all";

  return proxyToRails(request, endpoint, {
    method: "GET",
    authenticated: scope === "mine",
  });
}
