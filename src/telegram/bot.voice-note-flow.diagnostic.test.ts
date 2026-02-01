/**
 * Diagnostic test for issue #5718
 * Telegram voice notes: audio file path not passed to agent
 *
 * This test traces the entire flow of a voice note to identify where the path is lost.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Track what happens at each step
const flowTrace: string[] = [];
const trace = (step: string, data?: unknown) => {
  const msg = data ? `${step}: ${JSON.stringify(data)}` : step;
  flowTrace.push(msg);
  console.log(`[TRACE] ${msg}`);
};

// Mock the media store
vi.mock("../media/store.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../media/store.js")>();
  return {
    ...actual,
    saveMediaBuffer: vi.fn(async (buffer: Buffer, contentType?: string) => {
      const result = {
        id: "voice-uuid-123",
        path: "/home/user/.openclaw/media/inbound/voice-uuid-123.ogg",
        size: buffer.byteLength,
        contentType: contentType ?? "audio/ogg",
      };
      trace("saveMediaBuffer", { contentType, resultPath: result.path });
      return result;
    }),
  };
});

// Mock fetch for Telegram file download
vi.mock("../media/fetch.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../media/fetch.js")>();
  return {
    ...actual,
    fetchRemoteMedia: vi.fn(async () => {
      const result = {
        buffer: Buffer.from("fake-ogg-audio-data"),
        contentType: "audio/ogg",
        fileName: "voice.ogg",
      };
      trace("fetchRemoteMedia", { contentType: result.contentType });
      return result;
    }),
  };
});

// Import after mocks
import { normalizeAttachments, selectAttachments } from "../media-understanding/attachments.js";
import { buildInboundMediaNote } from "../auto-reply/media-note.js";
import type { MsgContext } from "../auto-reply/templating.js";

describe("Voice Note Flow Diagnostic (#5718)", () => {
  beforeEach(() => {
    flowTrace.length = 0;
  });

  afterEach(() => {
    console.log("\n=== FLOW TRACE ===");
    flowTrace.forEach((line, i) => console.log(`${i + 1}. ${line}`));
    console.log("==================\n");
  });

  it("Step 1: Check if MediaPath would be set correctly", () => {
    // Simulate what bot-message-context.ts does
    const allMedia = [
      {
        path: "/home/user/.openclaw/media/inbound/voice-uuid-123.ogg",
        contentType: "audio/ogg",
      },
    ];

    trace("allMedia from resolveMedia", allMedia);

    // This is what bot-message-context.ts does
    const stickerCacheHit = false;
    const MediaPath = stickerCacheHit ? undefined : allMedia[0]?.path;
    const MediaType = stickerCacheHit ? undefined : allMedia[0]?.contentType;
    const MediaPaths = stickerCacheHit
      ? undefined
      : allMedia.length > 0
        ? allMedia.map((m) => m.path)
        : undefined;
    const MediaTypes = stickerCacheHit
      ? undefined
      : allMedia.length > 0
        ? allMedia.map((m) => m.contentType)
        : undefined;

    trace("Context fields set", { MediaPath, MediaType, MediaPaths, MediaTypes });

    expect(MediaPath).toBe("/home/user/.openclaw/media/inbound/voice-uuid-123.ogg");
    expect(MediaType).toBe("audio/ogg");
    expect(MediaPaths).toEqual(["/home/user/.openclaw/media/inbound/voice-uuid-123.ogg"]);
  });

  it("Step 2: Check if normalizeAttachments detects audio", () => {
    const ctx: Partial<MsgContext> = {
      MediaPath: "/home/user/.openclaw/media/inbound/voice-uuid-123.ogg",
      MediaType: "audio/ogg",
      MediaPaths: ["/home/user/.openclaw/media/inbound/voice-uuid-123.ogg"],
      MediaTypes: ["audio/ogg"],
    };

    trace("Input context", ctx);

    const attachments = normalizeAttachments(ctx as MsgContext);
    trace("normalizeAttachments result", attachments);

    expect(attachments.length).toBe(1);
    expect(attachments[0]?.path).toBe("/home/user/.openclaw/media/inbound/voice-uuid-123.ogg");
    expect(attachments[0]?.mime).toBe("audio/ogg");
  });

  it("Step 3: Check if selectAttachments identifies audio", () => {
    const attachments = [
      {
        path: "/home/user/.openclaw/media/inbound/voice-uuid-123.ogg",
        mime: "audio/ogg",
        index: 0,
      },
    ];

    trace("Input attachments", attachments);

    const selected = selectAttachments({
      capability: "audio",
      attachments,
    });

    trace("selectAttachments('audio') result", selected);

    expect(selected.length).toBe(1);
    expect(selected[0]?.path).toBe("/home/user/.openclaw/media/inbound/voice-uuid-123.ogg");
  });

  it("Step 4: Check buildInboundMediaNote when transcription is SKIPPED", () => {
    // Simulate context after media understanding SKIPPED audio
    const ctx: Partial<MsgContext> = {
      MediaPath: "/home/user/.openclaw/media/inbound/voice-uuid-123.ogg",
      MediaType: "audio/ogg",
      MediaPaths: ["/home/user/.openclaw/media/inbound/voice-uuid-123.ogg"],
      MediaTypes: ["audio/ogg"],
      MediaUrls: ["/home/user/.openclaw/media/inbound/voice-uuid-123.ogg"],
      // When transcription is skipped, MediaUnderstanding is empty
      MediaUnderstanding: [],
      // Decision shows it was skipped
      MediaUnderstandingDecisions: [
        {
          capability: "audio",
          outcome: "skipped",
          attachments: [{ attachmentIndex: 0, attempts: [] }],
        },
      ],
    };

    trace("Context after skipped transcription", {
      MediaPath: ctx.MediaPath,
      MediaUnderstanding: ctx.MediaUnderstanding,
      MediaUnderstandingDecisions: ctx.MediaUnderstandingDecisions,
    });

    const mediaNote = buildInboundMediaNote(ctx as MsgContext);
    trace("buildInboundMediaNote result", mediaNote);

    expect(mediaNote).toBeDefined();
    expect(mediaNote).toContain("/home/user/.openclaw/media/inbound/voice-uuid-123.ogg");
    expect(mediaNote).toContain("audio/ogg");
  });

  it("Step 5: Check buildInboundMediaNote when transcription SUCCEEDS", () => {
    // Simulate context after media understanding SUCCEEDED
    const ctx: Partial<MsgContext> = {
      MediaPath: "/home/user/.openclaw/media/inbound/voice-uuid-123.ogg",
      MediaType: "audio/ogg",
      MediaPaths: ["/home/user/.openclaw/media/inbound/voice-uuid-123.ogg"],
      MediaTypes: ["audio/ogg"],
      MediaUrls: ["/home/user/.openclaw/media/inbound/voice-uuid-123.ogg"],
      // When transcription succeeds, output is added
      MediaUnderstanding: [
        {
          kind: "audio.transcription",
          text: "Hello, this is a test message",
          attachmentIndex: 0,
        },
      ],
      MediaUnderstandingDecisions: [
        {
          capability: "audio",
          outcome: "success",
          attachments: [
            {
              attachmentIndex: 0,
              attempts: [{ provider: "openai", outcome: "success" }],
              chosen: { provider: "openai", outcome: "success" },
            },
          ],
        },
      ],
    };

    trace("Context after successful transcription", {
      MediaPath: ctx.MediaPath,
      MediaUnderstanding: ctx.MediaUnderstanding,
    });

    const mediaNote = buildInboundMediaNote(ctx as MsgContext);
    trace("buildInboundMediaNote result (should be undefined - audio was processed)", mediaNote);

    // When transcription succeeds, the media note should be suppressed
    // because the audio content is now in the transcript
    expect(mediaNote).toBeUndefined();
  });

  it("Step 6: Check what happens with EMPTY MediaPath", () => {
    // This is what might be happening in the bug!
    const ctx: Partial<MsgContext> = {
      MediaPath: undefined, // <-- This could be the problem
      MediaType: "audio/ogg",
      MediaPaths: undefined, // <-- Or this
      MediaTypes: undefined,
      Body: "<media:audio>",
    };

    trace("Context with missing MediaPath (potential bug scenario)", ctx);

    const attachments = normalizeAttachments(ctx as MsgContext);
    trace("normalizeAttachments with missing path", attachments);

    const mediaNote = buildInboundMediaNote(ctx as MsgContext);
    trace("buildInboundMediaNote with missing path", mediaNote);

    // If MediaPath is not set, we get nothing
    expect(attachments.length).toBe(0);
    expect(mediaNote).toBeUndefined();
  });

  it("Step 7: Check MIME detection for .ogg files", async () => {
    const { kindFromMime } = await import("../media/mime.js");
    const { isAudioFileName } = await import("../media/mime.js");

    const mimeResult = kindFromMime("audio/ogg");
    trace("kindFromMime('audio/ogg')", mimeResult);
    expect(mimeResult).toBe("audio");

    const fileNameResult = isAudioFileName("/path/to/voice.ogg");
    trace("isAudioFileName('/path/to/voice.ogg')", fileNameResult);
    expect(fileNameResult).toBe(true);

    // What if MIME is undefined?
    const undefinedMime = kindFromMime(undefined);
    trace("kindFromMime(undefined)", undefinedMime);
    expect(undefinedMime).toBe("unknown");
  });

  it("DIAGNOSTIC: Trace full context building for voice message", () => {
    // Simulate the FULL flow as it would happen in bot-message-context.ts

    // 1. Message comes in with voice
    const msg = {
      voice: {
        file_id: "voice-file-id-123",
        file_unique_id: "voice-unique-id",
        duration: 5,
        mime_type: "audio/ogg",
      },
      text: undefined,
      caption: undefined,
    };
    trace("Incoming Telegram message", { hasVoice: !!msg.voice, hasText: !!msg.text });

    // 2. Placeholder is determined
    let placeholder = "";
    if (msg.voice) {
      placeholder = "<media:audio>";
    }
    trace("Placeholder determined", placeholder);

    // 3. rawBody is built (no text, so uses placeholder)
    const rawText = msg.text ?? msg.caption ?? "";
    let rawBody = rawText.trim() || placeholder;
    trace("rawBody", rawBody);

    // 4. resolveMedia would download and return media info
    const media = {
      path: "/home/user/.openclaw/media/inbound/voice-uuid-123.ogg",
      contentType: "audio/ogg",
      placeholder: "<media:audio>",
    };
    trace("resolveMedia result", media);

    // 5. allMedia is built
    const allMedia = media ? [{ path: media.path, contentType: media.contentType }] : [];
    trace("allMedia array", allMedia);

    // 6. Context fields are set
    const ctxPayload = {
      Body: rawBody,
      MediaPath: allMedia[0]?.path,
      MediaType: allMedia[0]?.contentType,
      MediaUrl: allMedia[0]?.path,
      MediaPaths: allMedia.length > 0 ? allMedia.map((m) => m.path) : undefined,
      MediaUrls: allMedia.length > 0 ? allMedia.map((m) => m.path) : undefined,
      MediaTypes: allMedia.length > 0 ? allMedia.map((m) => m.contentType) : undefined,
    };
    trace("Final context payload", ctxPayload);

    // Verify all fields are set correctly
    expect(ctxPayload.Body).toBe("<media:audio>");
    expect(ctxPayload.MediaPath).toBe("/home/user/.openclaw/media/inbound/voice-uuid-123.ogg");
    expect(ctxPayload.MediaType).toBe("audio/ogg");
    expect(ctxPayload.MediaPaths).toHaveLength(1);

    console.log("\n✅ All context fields are correctly set when media is resolved.");
    console.log("❓ The bug must be either:");
    console.log("   1. resolveMedia returns null (media not detected)");
    console.log("   2. Media understanding clears the path incorrectly");
    console.log("   3. Provider auto-detection fails silently");
  });
});
