import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      {
        error: true,
        message: "Unauthorized",
      },
      { status: 401 },
    );
  }

  try {
    const response = await axios.get(`${process.env.RAILS_API_URL}/users/me`, {
      headers: {
        Authorization: accessToken,
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error.response?.data?.message || "Unauthorized",
      },
      {
        status: error.response?.status || 401,
      },
    );
  }
}
