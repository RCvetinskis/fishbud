import { NextRequest, NextResponse } from "next/server";
import { getAuthorizationHeaders } from "./auth-header";

type ProxyOptions = {
  method?: string;
  authenticated?: boolean;
  body?: BodyInit | null;
  headers?: HeadersInit;
};

function getCookieValue(
  setCookies: string[],
  name: string,
): string | undefined {
  for (const cookie of setCookies) {
    const pair = cookie.split(";")[0];
    const separator = pair.indexOf("=");

    if (separator < 0) continue;

    if (pair.slice(0, separator).trim() === name) {
      return pair.slice(separator + 1);
    }
  }

  return undefined;
}

function forwardCookies(response: NextResponse, cookies: string[]) {
  for (const cookie of cookies) {
    response.headers.append("Set-Cookie", cookie);
  }
}

export async function proxyToRails(
  request: NextRequest,
  endpoint: string,
  options: ProxyOptions = {},
) {
  const {
    method = request.method,
    authenticated = true,
    body,
    headers: extraHeaders,
  } = options;

  const url = new URL(endpoint, process.env.RAILS_API_URL);

  // Preserve query parameters from the incoming request.
  request.nextUrl.searchParams.forEach((value, key) => {
    url.searchParams.set(key, value);
  });

  const headers = new Headers({
    Accept: "application/json",
  });

  new Headers(extraHeaders).forEach((value, key) => {
    headers.set(key, value);
  });

  const isFormData =
    typeof body === "object" &&
    body !== null &&
    "get" in body &&
    typeof body.get === "function";

  if (body != null && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  let refreshedCookies: string[] = [];

  if (authenticated && !accessToken && !refreshToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const sendRequest = async () => {
    const requestHeaders = new Headers(headers);

    if (authenticated) {
      const authorization = getAuthorizationHeaders(request, accessToken);

      if (authorization) {
        new Headers(authorization).forEach((value, key) => {
          requestHeaders.set(key, value);
        });
      }
    }

    return fetch(url, {
      method,
      headers: requestHeaders,
      body: method === "GET" || method === "HEAD" ? undefined : body,
      cache: "no-store",
    });
  };

  try {
    let response = await sendRequest();

    if (authenticated && response.status === 401 && refreshToken) {
      // Refresh through the existing Next.js refresh route.
      const refreshResponse = await fetch(
        new URL("/api/auth/refresh", request.url),
        {
          method: "POST",
          headers: {
            cookie: request.headers.get("cookie") ?? "",
          },
          cache: "no-store",
        },
      );

      if (!refreshResponse.ok) {
        const unauthorized = NextResponse.json(
          { message: "Session expired. Please sign in again." },
          { status: 401 },
        );

        unauthorized.cookies.delete("access_token");
        unauthorized.cookies.delete("refresh_token");

        return unauthorized;
      }

      refreshedCookies = refreshResponse.headers.getSetCookie();

      accessToken = getCookieValue(refreshedCookies, "access_token");

      if (!accessToken) {
        return NextResponse.json(
          { message: "Refresh succeeded but no access token was returned." },
          { status: 502 },
        );
      }

      response = await sendRequest();
    }

    const result = new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    forwardCookies(result, refreshedCookies);

    return result;
  } catch (error) {
    console.error(`Failed to proxy request to ${endpoint}:`, error);

    return NextResponse.json(
      { message: "Failed to fetch from API" },
      { status: 502 },
    );
  }
}
