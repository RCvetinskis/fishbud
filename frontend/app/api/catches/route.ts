import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { revalidatePath } from "next/cache";

export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json(
      { error: true, message: "Unauthorized: missing access token" },
      { status: 401 },
    );
  }

  try {
    const incomingForm = await request.formData();
    const lakeId = incomingForm.get("catch[lake_id]");

    const outgoingForm = new FormData();

    incomingForm.forEach((value, key) => {
      outgoingForm.append(key, value);
    });

    const response = await axios.post(
      `${process.env.RAILS_API_URL}/catches`,
      outgoingForm,
      {
        headers: {
          Authorization: accessToken.startsWith("Bearer ")
            ? accessToken
            : `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        maxBodyLength: Infinity,
      },
    );

    if (lakeId) {
      revalidatePath(`/lakes/${lakeId}`);
    }

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: true,
        message: error.response?.data?.message,
      },
      {
        status: error.response?.status,
      },
    );
  }
}
