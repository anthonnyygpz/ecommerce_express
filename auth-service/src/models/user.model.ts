import { MessageAndError } from "shared/types";

export interface LoginUserBody {
  email: string;
  password: string;
}

export interface LoginAdminBody {
  email: string;
  password: string;
}

export interface CreateUserBody {
  email: string;
  password: string;
  username: string;
}
export interface LoginPromise {
  user_id: number;
  username: string;
  isAdmin?: boolean;
  password_hashed?: string;
  email: string;
}

export interface CreatePromise extends MessageAndError {
  user_id: number;
  username: string;
  email: string;
}

export interface LoginUserResponse extends MessageAndError {
  data?: {
    user_id?: number;
    username?: string;
    email?: string;
    role: string;
  };
}
export interface CreateUserResponse extends MessageAndError {
  data?: {
    user_id: number;
    username: string;
    email: string;
  };
}
