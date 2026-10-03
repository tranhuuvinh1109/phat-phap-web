export interface SignUpPayloadType {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignUpResponseType {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
  };
}

export interface SignInPayloadType {
  email: string;
  password: string;
}

export interface SignInResponseType {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
  };
}

export interface UserProfileResponseType {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt?: string;
}

export interface UserDetailResponseType {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
  createdAt?: string;
}
