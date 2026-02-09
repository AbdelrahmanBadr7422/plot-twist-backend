import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../.env.test");
dotenv.config({ path: envPath });

if (!process.env.DATABASE_URL) {
  dotenv.config();
}

process.env.NODE_ENV = "test";

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://postgres:postgres@localhost:5432/bookstore_test";
}

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-jwt-secret-key";
}

console.log("Test Environment Setup:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
console.log("JWT_SECRET exists:", !!process.env.JWT_SECRET);

jest.setTimeout(30000);

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
