import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!refreshToken) {
    return clearSession("Refresh token missing", 401);
  }

  try {
    const response = await axios.post(
      `${process.env.RAILS_API_URL}/users/refresh`,
      {},
      {
        headers: {
          "X-Refresh-Token": refreshToken,
          Accept: "application/json",
        },
        timeout: 10_000,
      },
    );

    const authorization = response.headers["authorization"] as
      | string
      | undefined;
    const newRefreshToken = response.headers["x-refresh-token"] as
      | string
      | undefined;

    const accessToken = authorization?.replace(/^Bearer\s+/i, "").trim();

    // Do not report success if Rails did not return both tokens.
    if (!accessToken || !newRefreshToken) {
      console.error("Rails refresh response missing token headers", {
        hasAccessToken: Boolean(accessToken),
        hasRefreshToken: Boolean(newRefreshToken),
      });

      return clearSession("Invalid refresh response", 502);
    }

    const result = NextResponse.json(response.data);

    result.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 60,
    });

    result.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });

    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Rails token refresh failed", {
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error("Token refresh failed", error);
    }

    return clearSession("Session expired", 401);
  }
}

function clearSession(message: string, status: number) {
  const response = NextResponse.json({ error: true, message }, { status });

  response.cookies.set("access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
