import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ProfileResponse,
} from "./auth.types";
import { createUser, findUserByEmail, getUserById } from "./auth.dao";
import { hashPassword, comparePassword } from "../../utils/hash";
import { generateToken } from "../../utils/jwt";
import { AppError } from "../../utils/app-error";

export const register = async (
  data: RegisterRequest,
): Promise<AuthResponse> => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    throw new AppError("Email already registered", 400);
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await createUser(data.email, hashedPassword, data.name);

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const user = await findUserByEmail(data.email);
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isValid = await comparePassword(data.password, user.password);
  if (!isValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  };
};

export const getProfile = async (userId: number): Promise<ProfileResponse> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return user;
};
