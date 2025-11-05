export interface UserModel {
  user_id: number;
  username: string;
  email: string;
  password_hashed?: string;
  address_id?: number;
  created_at?: string;
  updated_at?: string;
  status: string;
}

export interface LoginUserBody {
  email: string;
  password: string;
}

export interface CreateUserBody {
  email: string;
  password: string;
  username: string;
}

export interface UpdateUserBody {
  username: string;
  address_id: number;
  password: string;
}

export interface UserResponse {
  error?: string;
  message?: string;
  user?: {
    user_id?: number;
    username?: string;
    email?: string;
    status?: string;
  };
}
