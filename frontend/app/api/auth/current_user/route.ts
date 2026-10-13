import { NextRequest } from "next/server";
import { proxyToRails } from "@/lib/api/proxy";

export async function GET(request: NextRequest) {
  return proxyToRails(request, "/users/me");
}
