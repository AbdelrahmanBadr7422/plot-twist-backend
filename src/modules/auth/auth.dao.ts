import { prisma } from "../../config/prisma";
import { AuthUser, ProfileResponse } from "./auth.types";

// Export each function individually
export const createUser = async (
  email: string,
  password: string,
  name: string,
): Promise<AuthUser> => {
  const user = await prisma.user.create({
    data: {
      email,
      password,
      name,
      role: "USER",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const getUserById = async (
  id: number,
): Promise<ProfileResponse | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};
