import { NextRequest, NextResponse } from "next/server";

function getTokenExpiration(token: string) {
  try {
    const raw = token.replace(/^Bearer\s+/i, "");
    const payload = raw.split(".")[1];
    if (!payload) return null;
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString());
    return decoded.exp ?? null;
  } catch {
    return null;
  }
}
function nextWithPathname(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const pathname = request.nextUrl.pathname;

  const protectedRoutes = ["/", "/profile", "/map", "/lakes", "/statistics"];

  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  const isAuthRoute = pathname === "/auth" || pathname.startsWith("/auth/");

  if (isAuthRoute) {
    if (accessToken || refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return nextWithPathname(request);
  }

  if (!isProtectedRoute) {
    return nextWithPathname(request);
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

  if (exp - now <= 5) {
    return refreshSession(request);
  }

  return nextWithPathname(request);
}

async function refreshSession(request: NextRequest) {
  const response = await fetch(new URL("/api/auth/refresh", request.url), {
    method: "POST",
    headers: {
      cookie: request.headers.get("cookie") ?? "",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const redirectResponse = NextResponse.redirect(
      new URL("/auth/signin", request.url),
    );

    redirectResponse.cookies.set("access_token", "", {
      path: "/",
      maxAge: 0,
    });
    redirectResponse.cookies.set("refresh_token", "", {
      path: "/",
      maxAge: 0,
    });

    return redirectResponse;
  }

  const setCookies = response.headers.getSetCookie();
  const updatedCookies = new Map<string, string>();

  for (const cookie of setCookies) {
    const pair = cookie.split(";")[0];
    const separator = pair.indexOf("=");

    if (separator > 0) {
      updatedCookies.set(
        pair.slice(0, separator).trim(),
        pair.slice(separator + 1),
      );
    }
  }

  // Make the refreshed tokens available during this same page request.
  const requestHeaders = new Headers(request.headers);
  const cookieMap = new Map<string, string>();

  for (const part of (request.headers.get("cookie") ?? "").split(";")) {
    const separator = part.indexOf("=");

    if (separator > 0) {
      cookieMap.set(
        part.slice(0, separator).trim(),
        part.slice(separator + 1).trim(),
      );
    }
  }

  for (const name of ["access_token", "refresh_token"]) {
    const value = updatedCookies.get(name);
    if (value !== undefined) cookieMap.set(name, value);
  }

  requestHeaders.set(
    "cookie",
    Array.from(cookieMap, ([name, value]) => `${name}=${value}`).join("; "),
  );
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const nextResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  for (const cookie of setCookies) {
    nextResponse.headers.append("Set-Cookie", cookie);
  }

  return nextResponse;
}

export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/map/:path*",
    "/lakes/:path*",
    "/statistics/:path*",
  ],
};
