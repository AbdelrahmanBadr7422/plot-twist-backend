import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/hash";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await hashPassword("admin123");
  const admin = await prisma.user.create({
    data: {
      email: "admin@bookstore.com",
      password: adminPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  // Create regular user
  const userPassword = await hashPassword("user123");
  const user = await prisma.user.create({
    data: {
      email: "user@bookstore.com",
      password: userPassword,
      name: "Regular User",
      role: "USER",
    },
  });

  // Create sample books
  const books = [
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 9.99,
      stock: 50,
      description: "A romantic novel of manners.",
    },
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 12.99,
      stock: 30,
      description: "A novel about racial injustice.",
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 10.99,
      stock: 40,
      description: "A story of the Jazz Age.",
    },
    {
      title: "1984",
      author: "George Orwell",
      price: 8.99,
      stock: 60,
      description: "A dystopian social science fiction novel.",
    },
  ];

  for (const bookData of books) {
    await prisma.book.create({
      data: bookData,
    });
  }

  console.log("✅ Seeding completed!");
  console.log(`👤 Admin: ${admin.email} (password: admin123)`);
  console.log(`👤 User: ${user.email} (password: user123)`);
  console.log(`📚 Created ${books.length} books`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
