import { NextRequest } from "next/server";
import { statisticsProxy } from "@/lib/api/statistics-proxy";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  revalidatePath("/statistics/weather_statistics");
  return statisticsProxy(request, "/statistics/weather");
}
