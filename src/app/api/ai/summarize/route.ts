import { NextRequest, NextResponse } from "next/server";

import { summarizeTranscript } from "@/lib/ai/gemini";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.transcript !== "string" || !body.transcript.trim()) {
      return NextResponse.json(
        { error: "Transcript text is required." },
        { status: 400 }
      );
    }

    const summary = await summarizeTranscript(body.transcript);

    return NextResponse.json({ summary }, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate AI summary.";

    const status = message.includes("GEMINI_API_KEY") ? 500 : 400;

    return NextResponse.json({ error: message }, { status });
  }
};
