import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: true, message: "Unauthorized: missing access token" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const response = await axios.post(
      `${process.env.RAILS_API_URL}/spots`,
      body,
      {
        headers: {
          Authorization: accessToken.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      },
    );

    return NextResponse.json(response.data, {
      status: response.status,
    });
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
