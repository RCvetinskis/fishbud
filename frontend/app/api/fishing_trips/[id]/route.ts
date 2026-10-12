import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: Props) {
  const accessToken = request.cookies.get("access_token")?.value;
  const { id } = await params;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!/^\d+$/.test(id)) {
    return NextResponse.json(
      { error: "Invalid fishing trip ID" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.RAILS_API_URL}/fishing_trips/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: accessToken.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const data = await response.json();
    revalidatePath(`/lake/${id}`);
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error.response?.data?.message,
      },
      {
        status: error.response?.status,
      },
    );
  }
}
