import { NextRequest, NextResponse } from "next/server";

import axios from "axios";

export async function DELETE(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    const response = NextResponse.json(
      { error: false, message: "Logged out succesfully." },
      {
        status: 200,
      },
    );

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  }

  try {
    await axios.delete(`${process.env.RAILS_API_URL}/logout`, {
      headers: {
        Authorization: accessToken,
      },
    });
    const response = NextResponse.json(
      { error: false, message: "Logged out successfully." },
      { status: 200 },
    );
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");
    return response;
  } catch (error) {
    const response = NextResponse.json(
      { error: false, message: "Logged out successfully." },
      { status: 200 },
    );

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  }
}
