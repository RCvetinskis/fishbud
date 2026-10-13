import { NextRequest } from "next/server";

export const getAuthorizationHeaders = (
  request: NextRequest,
  tokenOverride?: string,
): HeadersInit | null => {
  const accessToken =
    tokenOverride ?? request.cookies.get("access_token")?.value;

  if (!accessToken) return null;

  return {
    Authorization: accessToken.startsWith("Bearer ")
      ? accessToken
      : `Bearer ${accessToken}`,
  };
};
