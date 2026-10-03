import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QueryKeyEnum } from "@/enums";
import { getMe, signIn, signUp } from "./auth.api";
import {
  SignInPayloadType,
  SignInResponseType,
  SignUpPayloadType,
  SignUpResponseType,
  UserProfileResponseType,
} from "./auth.type";

/**
 * Options type for useSignUp hook
 */
export type UseSignUpOptions = Omit<
  UseMutationOptions<SignUpResponseType, AxiosError, SignUpPayloadType>,
  "mutationFn"
>;

export const useSignUp = (
  options?: UseSignUpOptions
): UseMutationResult<SignUpResponseType, AxiosError, SignUpPayloadType> => {
  return useMutation({
    mutationFn: signUp,
    ...options,
  });
};

/**
 * Options type for useSignIn hook
 */
export type UseSignInOptions = Omit<
  UseMutationOptions<SignInResponseType, AxiosError, SignInPayloadType>,
  "mutationFn"
>;

export const useSignIn = (
  options?: UseSignInOptions
): UseMutationResult<SignInResponseType, AxiosError, SignInPayloadType> => {
  return useMutation({
    mutationFn: signIn,
    ...options,
  });
};

/**
 * Options type for useGetMe query hook
 */
export type UseGetMeOptions = Omit<
  UseQueryOptions<UserProfileResponseType, AxiosError, UserProfileResponseType>,
  "queryKey" | "queryFn"
>;

export const useGetMe = (
  options?: UseGetMeOptions
): UseQueryResult<UserProfileResponseType, AxiosError> => {
  return useQuery({
    queryKey: [QueryKeyEnum.ME],
    queryFn: getMe,
    ...options,
  });
};
