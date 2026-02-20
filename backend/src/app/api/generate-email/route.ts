import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/validation";
import { generateEmail } from "@/lib/openai";

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json().catch(() => null);

    const result = validateRequest(body);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const email = await generateEmail(result.data);

    return NextResponse.json(email);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";

    console.error("[generate-email] Error:", message);

    if (message.includes("OPENAI_API_KEY")) {
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate email. Please try again." },
      { status: 500 }
    );
  }
}
