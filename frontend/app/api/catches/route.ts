import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: true, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();

    const response = await axios.post(
      `${process.env.RAILS_API_URL}/catches`,
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
    console.log("CATCH:", body.catch);
    revalidatePath(`/lakes/${body.catch.lake_id}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error.response?.data?.message || "Something went wrong",
      },
      {
        status: error.response?.status || 401,
      },
    );
  }
}
