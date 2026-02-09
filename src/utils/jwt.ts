import jwt from "jsonwebtoken";
import { config } from "../config/env";

interface JwtPayload {
  userId: number;
  email: string;
  role: string;
}

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "7d",
    issuer: "plot-twist-api",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtSecret, {
    issuer: "plot-twist-api",
  }) as JwtPayload;
};

export const cookieOptions = {
  httpOnly: true,
  secure: config.nodeEnv === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};
