import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const response = await axios.post(
      `${process.env.RAILS_API_URL}/login`,
      body,
    );

    const accessToken = response.headers["authorization"];
    const refreshToken = response.headers["x-refresh-token"];

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        {
          error: true,
          message: "Authentication tokens missing",
        },
        { status: 401 },
      );
    }

    const result = NextResponse.json(response.data);

    result.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60,
    });

    result.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return result;
  } catch (error: any) {
    console.log("ERRORAS:", error);
    return NextResponse.json(
      {
        error: true,
        message: error.response?.data?.message || "Login failed",
      },
      {
        status: error.response?.status || 500,
      },
    );
  }
}
