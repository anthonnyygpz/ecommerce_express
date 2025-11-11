export interface UserSchema {
  user_id: number;
  username: string;
  email: string;
  address_id: number;
  password_hashed?: string;
  created_at: string;
  updated_at: string;
  isAdmin?: boolean;
  status?: string;
}
