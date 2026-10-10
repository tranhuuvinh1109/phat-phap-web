import { API_URL } from "@/constants";
import { apiClient } from "@/lib/axios";
import {
  GetTopPostsParams,
  GetTopPostsResponse,
  RecordPostEventPayload,
  RecordPostEventResponse,
} from "./analytics.type";

/**
 * Send post interaction event (VIEW, READ, LISTEN) via POST /analytics/posts/events
 */
export const recordPostEvent = async (
  payload: RecordPostEventPayload
): Promise<RecordPostEventResponse> => {
  const response = await apiClient.post<RecordPostEventResponse>(
    API_URL.analyticsEvents,
    payload
  );
  return response.data;
};

/**
 * Fetch top popular posts ranking via GET /analytics/posts/top
 */
export const getTopPosts = async (
  params?: GetTopPostsParams
): Promise<GetTopPostsResponse> => {
  const response = await apiClient.get<GetTopPostsResponse>(
    API_URL.analyticsTopPosts,
    { params }
  );
  return response.data;
};
