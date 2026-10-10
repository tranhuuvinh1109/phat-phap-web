import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useCallback, useEffect, useRef } from "react";

import { QueryKeyEnum } from "@/enums";
import { getTopPosts, recordPostEvent } from "./analytics.api";
import {
  AnalyticsEventType,
  GetTopPostsParams,
  GetTopPostsResponse,
  RecordPostEventPayload,
  RecordPostEventResponse,
} from "./analytics.type";

export type UseRecordPostEventOptions = Omit<
  UseMutationOptions<RecordPostEventResponse, AxiosError, RecordPostEventPayload>,
  "mutationFn"
>;

/**
 * Mutation hook to record a post interaction event via POST /analytics/posts/events
 */
export const useRecordPostEvent = (
  options?: UseRecordPostEventOptions
): UseMutationResult<RecordPostEventResponse, AxiosError, RecordPostEventPayload> => {
  return useMutation({
    mutationFn: recordPostEvent,
    ...options,
  });
};

export type UseGetTopPostsOptions = Omit<
  UseQueryOptions<GetTopPostsResponse, AxiosError>,
  "queryKey" | "queryFn"
>;

/**
 * Query hook to fetch popular top posts via GET /analytics/posts/top
 */
export const useGetTopPosts = (
  params?: GetTopPostsParams,
  options?: UseGetTopPostsOptions
): UseQueryResult<GetTopPostsResponse, AxiosError> => {
  return useQuery({
    queryKey: [QueryKeyEnum.GET_TOP_POSTS, params],
    queryFn: () => getTopPosts(params),
    staleTime: 60 * 1000, // Top rankings can be cached for 1 minute
    ...options,
  });
};

export interface UseEventOptions {
  postId?: string;
  autoTrackView?: boolean;
  autoTrackRead?: boolean;
  readDelayMs?: number; // default: 10,000ms (10 seconds)
  listenThresholdSeconds?: number; // default: 30 seconds
  onSuccess?: (type: AnalyticsEventType, data: RecordPostEventResponse) => void;
  onError?: (type: AnalyticsEventType, error: unknown) => void;
}

/**
 * Shared hook to track post interaction events (VIEW, READ, LISTEN) according to tracking policy:
 * - VIEW: Sent once on mount / render.
 * - READ: Sent after user stays on page for >= 10s (cancelled on early exit).
 * - LISTEN: Sent once when audio playback reaches >= 30s.
 *
 * Can be called with a postId string directly: useEvent("some-post-id")
 * or with options object: useEvent({ postId: "...", autoTrackView: true, autoTrackRead: true })
 */
export const useEvent = (input?: string | UseEventOptions) => {
  const options: UseEventOptions =
    typeof input === "string" ? { postId: input } : input || {};

  const {
    postId,
    autoTrackView = true,
    autoTrackRead = true,
    readDelayMs = 10000,
    listenThresholdSeconds = 30,
    onSuccess,
    onError,
  } = options;

  const mutation = useRecordPostEvent();

  // Deduplication flags (guards against React 19 / StrictMode double invocation)
  const hasTrackedView = useRef(false);
  const hasTrackedRead = useRef(false);
  const hasTrackedListen = useRef(false);
  const listenedPostIdsRef = useRef<Set<string>>(new Set());

  // Reset flags when target postId changes
  const prevPostIdRef = useRef<string | undefined>(postId);
  if (prevPostIdRef.current !== postId) {
    prevPostIdRef.current = postId;
    hasTrackedView.current = false;
    hasTrackedRead.current = false;
    hasTrackedListen.current = false;
  }

  /**
   * Core function to record an interaction event
   */
  const recordEvent = useCallback(
    async (
      type: AnalyticsEventType,
      targetPostId?: string
    ): Promise<RecordPostEventResponse | undefined> => {
      const target = targetPostId || postId;
      if (!target) {
        console.warn(`[useEvent] Cannot track ${type} event: missing postId`);
        return undefined;
      }

      try {
        const result = await mutation.mutateAsync({
          type,
          postId: target,
        });
        onSuccess?.(type, result);
        return result;
      } catch (error) {
        console.warn(`[useEvent] Failed to send ${type} event for post ${target}:`, error);
        onError?.(type, error);
        return undefined;
      }
    },
    [mutation, postId, onSuccess, onError]
  );

  /**
   * Helper: Send VIEW event once
   */
  const trackView = useCallback(
    (targetPostId?: string) => {
      if (hasTrackedView.current) return Promise.resolve(undefined);
      hasTrackedView.current = true;
      return recordEvent("VIEW", targetPostId);
    },
    [recordEvent]
  );

  /**
   * Helper: Send READ event once
   */
  const trackRead = useCallback(
    (targetPostId?: string) => {
      if (hasTrackedRead.current) return Promise.resolve(undefined);
      hasTrackedRead.current = true;
      return recordEvent("READ", targetPostId);
    },
    [recordEvent]
  );

  /**
   * Helper: Send LISTEN event immediately as soon as track starts playing
   */
  const trackListen = useCallback(
    (targetPostId?: string) => {
      const target = targetPostId || postId;
      if (!target) return Promise.resolve(undefined);
      if (listenedPostIdsRef.current.has(target)) return Promise.resolve(undefined);
      listenedPostIdsRef.current.add(target);
      hasTrackedListen.current = true;
      return recordEvent("LISTEN", target);
    },
    [recordEvent, postId]
  );

  /**
   * Helper for Audio Player: triggers LISTEN event as soon as audio plays
   */
  const onAudioTimeUpdate = useCallback(
    (currentPlaybackSeconds: number, targetPostId?: string) => {
      const target = targetPostId || postId;
      if (!target) return;

      if (currentPlaybackSeconds >= 0 && !listenedPostIdsRef.current.has(target)) {
        listenedPostIdsRef.current.add(target);
        hasTrackedListen.current = true;
        recordEvent("LISTEN", target);
      }
    },
    [recordEvent, postId]
  );

  // Auto-tracking policy: VIEW (immediate) & READ (10s delay)
  useEffect(() => {
    if (!postId) return;

    // 1. Track VIEW: Gửi 1 lần ngay khi mount
    if (autoTrackView && !hasTrackedView.current) {
      hasTrackedView.current = true;
      recordEvent("VIEW", postId);
    }

    // 2. Track READ: Chờ tối thiểu 10 giây người dùng đọc bài
    let readTimer: NodeJS.Timeout | null = null;
    if (autoTrackRead && !hasTrackedRead.current) {
      readTimer = setTimeout(() => {
        if (!hasTrackedRead.current) {
          hasTrackedRead.current = true;
          recordEvent("READ", postId);
        }
      }, readDelayMs);
    }

    return () => {
      if (readTimer) {
        clearTimeout(readTimer);
      }
    };
  }, [postId, autoTrackView, autoTrackRead, readDelayMs, recordEvent]);

  return {
    recordEvent,
    trackView,
    trackRead,
    trackListen,
    onAudioTimeUpdate,
    hasTrackedView: hasTrackedView.current,
    hasTrackedRead: hasTrackedRead.current,
    hasTrackedListen: hasTrackedListen.current,
    isPending: mutation.isPending,
  };
};
