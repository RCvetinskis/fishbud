import { NextRequest } from "next/server";
import { statisticsProxy } from "@/lib/api/statistics-proxy";

export async function GET(request: NextRequest) {
  return statisticsProxy(request, "/statistics/weather");
}
