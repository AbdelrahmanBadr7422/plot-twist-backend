import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Plot Twist Book Store API",
      version: "1.0.0",
      description: "REST API for Book Store Management System",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "token",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error message" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Success message" },
            data: { type: "object" },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "Authentication & Authorization APIs",
      },
      {
        name: "Book",
      },
      {
        name: "Order",
      },
    ],
  },
  apis: ["./src/routes.ts", "./src/modules/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        // This forces the exact order of tags
        tagsSorter: (a: string, b: string) => {
          const order = ["Authentication", "Books", "Orders", "Health"];
          return order.indexOf(a) - order.indexOf(b);
        },
        // This orders operations within each tag
        operationsSorter: (a: any, b: any) => {
          const order = ["get", "post", "put", "delete", "patch"];
          return (
            order.indexOf(a.get("method")) - order.indexOf(b.get("method"))
          );
        },
      },
    }),
  );

  console.log("Swagger docs: http://localhost:5000/api-docs");
};
