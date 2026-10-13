import { NextRequest } from "next/server";

import { proxyToRails } from "@/lib/api/proxy";
import { revalidatePath } from "next/cache";
type Props = {
  params: Promise<{ id: string }>;
};
export async function PATCH(request: NextRequest, { params }: Props) {
  const { id } = await params;
  const body = await request.text();
  revalidatePath(`/lake/${id}`);
  return proxyToRails(request, `/fishing_trips/${id}`, {
    method: "PATCH",
    body,
  });
}
