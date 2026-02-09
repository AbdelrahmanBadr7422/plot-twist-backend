import { prisma } from "../src/config/prisma";

process.env.NODE_ENV = "test";
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

beforeEach(async () => {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  (console.error as jest.Mock).mockRestore();
  await prisma.$disconnect();
});
