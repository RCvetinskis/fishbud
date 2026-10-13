import { NextRequest } from "next/server";

import { proxyToRails } from "@/lib/api/proxy";

export async function POST(request: NextRequest) {
  const body = await request.formData();

  return proxyToRails(request, "/catches", {
    method: "POST",
    body,
  });
}
