export interface IUser {
  email?: string;
  username: string;
  password: string;
  profile_pic?: string;
  role?: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
}
