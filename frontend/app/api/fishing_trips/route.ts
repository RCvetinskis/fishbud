import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const response = await fetch(`${process.env.RAILS_API_URL}/fishing_trips`, {
      method: "POST",
      headers: {
        Authorization: accessToken.startsWith("Bearer ")
          ? accessToken
          : `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await response.json();
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
