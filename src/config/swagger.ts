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
          description: "JWT token stored in HTTP-only cookie",
        },
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Success message",
            },
            data: {
              type: "object",
            },
          },
        },
        Book: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            title: {
              type: "string",
              example: "The Great Gatsby",
            },
            author: {
              type: "string",
              example: "F. Scott Fitzgerald",
            },
            price: {
              type: "number",
              format: "float",
              example: 12.99,
            },
            stock: {
              type: "integer",
              example: 50,
            },
            description: {
              type: "string",
              example: "A classic novel about the American Dream",
            },
            coverImage: {
              type: "string",
              example: "https://example.com/book-cover.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            name: {
              type: "string",
              example: "John Doe",
            },
            role: {
              type: "string",
              enum: ["USER", "ADMIN"],
              example: "USER",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
        },
        OrderItem: {
          type: "object",
          properties: {
            bookId: {
              type: "integer",
              example: 1,
            },
            quantity: {
              type: "integer",
              example: 2,
            },
            price: {
              type: "number",
              example: 25.98,
            },
          },
        },
        Order: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1,
            },
            userId: {
              type: "integer",
              example: 1,
            },
            totalAmount: {
              type: "number",
              example: 99.99,
            },
            status: {
              type: "string",
              enum: [
                "PENDING",
                "PROCESSING",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED",
              ],
              example: "PENDING",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2024-01-01T00:00:00.000Z",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description: "User registration, login, profile, and logout",
      },
      {
        name: "Books",
        description: "Book management operations",
      },
      {
        name: "Orders",
        description: "Order management operations",
      },
    ],
  },
  apis: ["./src/modules/**/*.controller.ts"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      swaggerOptions: {
        withCredentials: true,
        tagsSorter: (a: string, b: string) => {
          const order = ["Authentication", "Books", "Orders"];
          return order.indexOf(a) - order.indexOf(b);
        },
        operationsSorter: (a: any, b: any) => {
          const order = ["get", "post", "put", "delete"];
          return (
            order.indexOf(a.get("method")) - order.indexOf(b.get("method"))
          );
        },
      },
    }),
  );

  console.log(
    "Swagger documentation available at: http://localhost:5000/api-docs",
  );
};
