import { NextRequest } from "next/server";
import { statisticsProxy } from "@/lib/api/statistics-proxy";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
  revalidatePath("/statistics/top_fishing_trips");

  return statisticsProxy(request, "/statistics/catches/top_fishing_trips");
}
