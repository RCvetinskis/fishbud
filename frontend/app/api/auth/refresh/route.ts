import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      {
        error: true,
        message: "Refresh token missing",
      },
      { status: 401 },
    );
  }

  try {
    const response = await axios.post(
      `${process.env.RAILS_API_URL}/users/refresh`,
      {},
      {
        headers: {
          "X-Refresh-Token": refreshToken,
        },
      },
    );

    const accessToken = response.headers["authorization"];
    const newRefreshToken = response.headers["x-refresh-token"];

    const result = NextResponse.json(response.data);

    if (accessToken) {
      result.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 60,
      });
    }

    if (newRefreshToken) {
      result.cookies.set("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
    }

    return result;
  } catch {
    const result = NextResponse.json(
      {
        error: true,
        message: "Session expired",
      },
      { status: 401 },
    );

    result.cookies.delete("access_token");
    result.cookies.delete("refresh_token");

    return result;
  }
}
