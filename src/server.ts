import app from "./app";
import { config } from "./config/env";
import { prisma } from "./config/prisma";

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected");

    if (config.nodeEnv === "development") {
      console.log("Development mode - security relaxed");
    } else {
      console.log("Production mode - security active");
    }

    app.listen(config.port, () => {
      console.log(`Server: http://localhost:${config.port}`);
      console.log(`Docs: http://localhost:${config.port}/api-docs`);
    });
  } catch (error) {
    console.error("Failed to start:", error);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});


if (process.env.NODE_ENV !== "test") {
  startServer();
}
