import { API_URL } from "@/constants";
import { apiClient } from "@/lib/axios";
import {
  SignInPayloadType,
  SignInResponseType,
  SignUpPayloadType,
  SignUpResponseType,
  UserProfileResponseType,
} from "./auth.type";

export const signUp = async (payload: SignUpPayloadType): Promise<SignUpResponseType> => {
  const response = await apiClient.post<SignUpResponseType>(API_URL.signUp, payload);
  return response.data;
};

export const signIn = async (payload: SignInPayloadType): Promise<SignInResponseType> => {
  const response = await apiClient.post<SignInResponseType>(API_URL.signIn, payload);
  return response.data;
};

export const getMe = async (): Promise<UserProfileResponseType> => {
  try {
    const response = await apiClient.get<
      UserProfileResponseType | { user: UserProfileResponseType } | { data: UserProfileResponseType }
    >(API_URL.me);

    const data = response.data;
    if (data && typeof data === "object") {
      if ("user" in data && data.user) return data.user as UserProfileResponseType;
      if ("data" in data && data.data) return data.data as UserProfileResponseType;
    }
    return data as UserProfileResponseType;
  } catch (error: any) {
    // If configured route returns 404, attempt fallback to /me (or /auth/me)
    if (error?.response?.status === 404) {
      const fallbackUrl = API_URL.me === "/me" ? "/auth/me" : "/me";
      const fallbackResponse = await apiClient.get<
        UserProfileResponseType | { user: UserProfileResponseType } | { data: UserProfileResponseType }
      >(fallbackUrl);
      const data = fallbackResponse.data;
      if (data && typeof data === "object") {
        if ("user" in data && data.user) return data.user as UserProfileResponseType;
        if ("data" in data && data.data) return data.data as UserProfileResponseType;
      }
      return data as UserProfileResponseType;
    }
    throw error;
  }
};
