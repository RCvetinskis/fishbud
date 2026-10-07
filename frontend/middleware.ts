import { NextRequest, NextResponse } from "next/server";

function getTokenExpiration(token: string) {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());

    return decoded.exp ?? null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const pathname = request.nextUrl.pathname;

  // Routes that require authentication.
  const protectedRoutes = ["/", "/profile"];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  // Routes that are only for unauthenticated users.
  const isAuthRoute = pathname === "/auth" || pathname.startsWith("/auth/");

  if (isAuthRoute) {
    if (accessToken || refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  }

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  if (!accessToken && refreshToken) {
    return refreshSession(request);
  }

  const exp = getTokenExpiration(accessToken!);

  if (!exp) {
    return refreshSession(request);
  }

  const now = Math.floor(Date.now() / 1000);

  if (exp - now <= 60) {
    return refreshSession(request);
  }

  return NextResponse.next();
}

async function refreshSession(request: NextRequest) {
  const refreshUrl = new URL("/api/auth/refresh", request.url);

  const response = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  if (!response.ok) {
    const redirectResponse = NextResponse.redirect(
      new URL("/auth/login", request.url),
    );

    redirectResponse.cookies.delete("access_token");
    redirectResponse.cookies.delete("refresh_token");

    return redirectResponse;
  }

  const nextResponse = NextResponse.next();

  const setCookies = response.headers.getSetCookie();

  for (const cookie of setCookies) {
    nextResponse.headers.append("Set-Cookie", cookie);
  }

  return nextResponse;
}

export const config = {
  matcher: ["/", "/profile/:path*", "/auth/:path*"],
};
