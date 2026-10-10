import { AnalyticsEventTypeEnum, AnalyticsPeriodEnum } from "@/enums";

export type AnalyticsEventType =
  | "VIEW"
  | "READ"
  | "LISTEN"
  | AnalyticsEventTypeEnum;

export type AnalyticsPeriodType =
  | "DAY"
  | "WEEK"
  | "MONTH"
  | "YEAR"
  | AnalyticsPeriodEnum;

export interface RecordPostEventPayload {
  type: AnalyticsEventType;
  postId: string;
}

export interface RecordPostEventResponse {
  success: boolean;
  message: string;
}

export interface GetTopPostsParams {
  type?: AnalyticsEventType;
  period?: AnalyticsPeriodType;
  limit?: number;
}

export interface TopPostItemType {
  postId: string;
  title: string;
  slug: string;
  type: string;
  thumbnailUrl: string | null;
  totalCount: string;
}

export interface GetTopPostsMeta {
  type: AnalyticsEventType;
  period: AnalyticsPeriodType;
  startDate: string;
  endDate: string;
  limit: number;
}

export interface GetTopPostsResponse {
  data: TopPostItemType[];
  meta: GetTopPostsMeta;
}
