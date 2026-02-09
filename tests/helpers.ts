import { prisma } from "../src/config/prisma";

export const createBook = async () => {
  return prisma.book.create({
    data: {
      title: "Test Book",
      author: "Test Author",
      price: 100,
      stock: 5,
      isbn: `978-${Date.now()}`,
    },
  });
};
د;

export const createUserAndLogin = async () => {
  await request(app).post("/api/auth/register").send({
    email: "order@test.com",
    password: "Password123",
    name: "User",
  });

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "order@test.com",
    password: "Password123",
  });

  return loginRes.headers["set-cookie"];
};
