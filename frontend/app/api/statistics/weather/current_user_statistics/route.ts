import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${process.env.RAILS_API_URL}/statistics/weather/current_user_statistics`,
      {
        method: "GET",
        headers: {
          Authorization: accessToken.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const data = await response.json();

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error("Failed to fetch personal weather statistics:", error);

    return NextResponse.json(
      { message: "Failed to fetch weather statistics" },
      { status: 502 },
    );
  }
}
