import dotenv from "dotenv";

dotenv.config();

process.env.NODE_ENV = "test";

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  jest.restoreAllMocks();
});
