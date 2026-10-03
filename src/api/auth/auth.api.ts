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
  const response = await apiClient.get<UserProfileResponseType>(API_URL.me);
  return response.data;
};
