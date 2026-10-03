import { NextRequest, NextResponse } from "next/server";

import { extractVideoId } from "@/lib/youtube/extract-video-id";
import { getTranscript } from "@/lib/youtube/transcript";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    const lang = searchParams.get("lang") || undefined;

    if (!url) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(url);

    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const transcriptData = await getTranscript(videoId, lang);

    return NextResponse.json(transcriptData, { status: 200 });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to connect to transcript service.";

    if (
      message.includes("not available") ||
      message.includes("not found") ||
      message.includes("No caption tracks")
    ) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    if (message.includes("Invalid")) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Unable to load transcript." },
      { status: 500 }
    );
  }
};
