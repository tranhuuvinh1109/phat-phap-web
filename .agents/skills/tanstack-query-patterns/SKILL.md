---
name: tanstack-query-patterns
description: >-
  Use this skill when fetching, caching, or mutating server data, creating API functions and TanStack Query v5 hooks, configuring query key enums, or defining typed mutation and query custom hooks.
---

# TanStack Query v5 & API Architecture Patterns

All API requests and TanStack Query hooks in this project follow a feature-based structure under `src/api/<feature>/`.

## 1. Directory & File Organization

For any domain or feature (e.g., `auth`, `user`, `post`):

```text
src/
├── api/
│   └── <feature>/
│       ├── <feature>.api.ts    # API call functions using apiClient & API_URL
│       ├── <feature>.type.ts   # Request payload and response data interfaces (PascalCase)
│       └── <feature>.hook.ts   # TanStack Query custom hooks (useMutation, useQuery)
├── constants/
│   ├── apiURL.ts              # API endpoint path constants (API_URL)
│   └── index.ts
└── enums/
    ├── query-keys.enum.ts     # QueryKeyEnum: define direct query keys
    └── index.ts
```

---

## 2. Type Naming Convention (PascalCase)

Always use **PascalCase** for all types and interfaces in `<feature>.type.ts`:

- Request payloads: `SignUpPayloadType`, `SignInPayloadType`, `CreatePostPayloadType`
- Response data: `SignUpResponseType`, `SignInResponseType`, `UserProfileResponseType`, `UserDetailResponseType`

---

## 3. API Function Pattern (`<feature>.api.ts`)

Always use `apiClient` from `@/lib/axios`, reference `API_URL` from `@/constants`, and return `response.data`:

```typescript
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

export const getProfile = async (): Promise<UserProfileResponseType> => {
  const response = await apiClient.get<UserProfileResponseType>(API_URL.profile);
  return response.data;
};
```

---

## 4. Custom Hook Pattern with Props & Type Safety (`<feature>.hook.ts`)

Every custom hook MUST:
1. Accept TanStack Query options (`onSuccess`, `onError`, `retry`, `enabled`, etc.) as optional props using `Omit<Use...Options, 'mutationFn'>` or `Omit<Use...Options, 'queryKey' | 'queryFn'>`.
2. Return strongly-typed `UseMutationResult` or `UseQueryResult`.
3. Use `QueryKeyEnum` directly in `queryKey: [QueryKeyEnum.NAME, ...params]`.

### A. Mutation Hook (`useMutation`)

```typescript
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { signUp } from "./auth.api";
import { SignUpPayloadType, SignUpResponseType } from "./auth.type";

/**
 * Options type: allows callers to pass onSuccess, onError, onSettled, retry, etc.
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
```

**Caller Usage Example**:
```typescript
const { mutate, isPending } = useSignUp({
  onSuccess: (data) => {
    console.log("Registered user:", data.user);
  },
  onError: (error) => {
    alert(error.message);
  },
});

// Trigger:
mutate({ email: "user@example.com", password: "secretPassword" });
```

---

### B. Query Hook (`useQuery`)

Query keys are referenced directly from `QueryKeyEnum` in `src/enums/`:

```typescript
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { QueryKeyEnum } from "@/enums";
import { getProfile, getUserDetail } from "./auth.api";
import { UserDetailResponseType, UserProfileResponseType } from "./auth.type";

/**
 * Options type: allows callers to pass select, enabled, staleTime, retry, etc.
 */
export type UseUserProfileOptions = Omit<
  UseQueryOptions<UserProfileResponseType, AxiosError, UserProfileResponseType>,
  "queryKey" | "queryFn"
>;

export const useUserProfile = (
  options?: UseUserProfileOptions
): UseQueryResult<UserProfileResponseType, AxiosError> => {
  return useQuery({
    queryKey: [QueryKeyEnum.GET_USER_PROFILE],
    queryFn: getProfile,
    ...options,
  });
};
```

**Query Hook with Dynamic Arguments**:
```typescript
export type UseUserDetailOptions = Omit<
  UseQueryOptions<UserDetailResponseType, AxiosError, UserDetailResponseType>,
  "queryKey" | "queryFn"
>;

export const useUserDetail = (
  userId: string,
  options?: UseUserDetailOptions
): UseQueryResult<UserDetailResponseType, AxiosError> => {
  return useQuery({
    queryKey: [QueryKeyEnum.GET_USER_PROFILE, userId],
    queryFn: () => getUserDetail(userId),
    enabled: Boolean(userId),
    ...options,
  });
};
```

---

## 5. QueryKeyEnum Convention (`src/enums/query-keys.enum.ts`)

Define all query keys directly as uppercase enums:

```typescript
export enum QueryKeyEnum {
  AUTH = "AUTH",
  USER = "USER",
  GET_USER_PROFILE = "GET_USER_PROFILE",
  GET_POST_DETAIL = "GET_POST_DETAIL",
  GET_POSTS_LIST = "GET_POSTS_LIST",
}
```

---

## 6. Golden Rules for Vibe Coding & Performance

1. **Always return `response.data`** from API functions so hook callers receive pure response payload without unwrapping `AxiosResponse`.
2. **PascalCase for Types**: Always name interfaces and types with PascalCase (e.g., `UserDetailResponseType`, `SignUpPayloadType`).
3. **Never duplicate server cache into Zustand**: Always consume TanStack Query hooks directly in UI components. Use `select` in `useQuery` for computed / transformed data.
4. **Props Forwarding**: Always expose `options?: Use...Options` so components can attach local callbacks (`onSuccess`, `onError`) or control lifecycle (`enabled`).
5. **Direct Enums in Query Keys**: Use `[QueryKeyEnum.SOME_KEY, ...params]` directly, keeping cache keys consistent across the entire application.
