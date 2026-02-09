// Request types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Response types
export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface ProfileResponse {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}
