import { NextRequest } from "next/server";
import { describe, expect, it, vi } from "vitest";

import { POST as summarizeRoute } from "../ai/summarize/route";
import { GET as getTranscriptRoute } from "../transcript/route";

// Mock YouTube transcript module
vi.mock("@/lib/youtube/transcript", () => ({
  getTranscript: vi.fn(async (videoId: string) => {
    if (videoId === "invalidId12") {
      throw new Error("Transcript is not available for this video.");
    }
    return {
      videoId,
      language: "en",
      availableLanguages: [{ code: "en", name: "English" }, { code: "vi", name: "Tiếng Việt" }],
      segments: [
        { id: 0, start: 0, duration: 3.2, end: 3.2, text: "Hello everyone." },
        {
          id: 1,
          start: 3.2,
          duration: 4.1,
          end: 7.3,
          text: "Today we are going to learn Next.js.",
        },
      ],
    };
  }),
}));

// Mock Gemini AI module
vi.mock("@/lib/ai/gemini", () => ({
  summarizeTranscript: vi.fn(async (transcript: string) => {
    if (!transcript) {
      throw new Error("Transcript text is required.");
    }
    return "This video covers Next.js and live transcript synchronization.";
  }),
}));

describe("API Route Handlers", () => {
  describe("GET /api/transcript", () => {
    it("should return 400 for missing or invalid YouTube URL", async () => {
      const request = new NextRequest("http://localhost:3000/api/transcript?url=invalid");
      const response = await getTranscriptRoute(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json).toEqual({ error: "Invalid YouTube URL" });
    });

    it("should return 200 with transcript data for valid YouTube URL", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/transcript?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      );
      const response = await getTranscriptRoute(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.videoId).toBe("dQw4w9WgXcQ");
      expect(json.segments).toHaveLength(2);
      expect(json.segments[0].end).toBe(3.2);
      expect(json.availableLanguages).toHaveLength(2);
    });
  });

  describe("POST /api/ai/summarize", () => {
    it("should return 400 for empty transcript body", async () => {
      const request = new NextRequest("http://localhost:3000/api/ai/summarize", {
        method: "POST",
        body: JSON.stringify({ transcript: "" }),
      });
      const response = await summarizeRoute(request);
      const json = await response.json();

      expect(response.status).toBe(400);
      expect(json.error).toBe("Transcript text is required.");
    });

    it("should return 200 with AI summary for valid transcript", async () => {
      const request = new NextRequest("http://localhost:3000/api/ai/summarize", {
        method: "POST",
        body: JSON.stringify({ transcript: "Hello everyone, welcome to Next.js" }),
      });
      const response = await summarizeRoute(request);
      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.summary).toBe(
        "This video covers Next.js and live transcript synchronization."
      );
    });
  });
});
