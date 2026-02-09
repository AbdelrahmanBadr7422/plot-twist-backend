# Plot Twist Book Store API

![Node.js](https://img.shields.io/badge/Node.js-18+-green) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12+-blue)

## About the Project

This is a backend API for a bookstore management system called **Plot Twist**. Built with Node.js, Express, TypeScript, and PostgreSQL, it handles user authentication, book inventory, and order processing. The project is designed to be clean, easy to understand, and ready for real-world use.

## Key Features

### Authentication & Authorization

* Register and log in users with JWT
* Role-based access (USER/ADMIN)
* HTTP-only cookies for security
* Middleware protects sensitive routes

### Book Management

* Create, read, update, delete books
* Only admins can modify or delete books
* Public can browse available books
* Manage stock levels

### Order Management

* Users can place orders with multiple books
* View personal order history
* Cancel orders (restocks automatically)
* Admins can view all orders and update statuses

### Security

* Passwords hashed with bcrypt
* JWT expiration handling
* Rate limiting to prevent abuse
* CORS configured
* Helmet.js for HTTP headers security

### Testing

* Unit tests for all modules
* Integration tests for API endpoints
* Covers over 90% of the code

### Documentation

* Swagger/OpenAPI docs available at `/api-docs`
* TypeScript types and interfaces included

## Tech Stack

* **Backend:** Node.js + Express
* **Language:** TypeScript
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Auth:** JWT with HTTP-only cookies
* **Validation:** express-validator
* **Testing:** Jest + Supertest
* **Security:** Helmet, CORS, Rate Limiting

## Project Structure

```
plot-twist-backend/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   ├── book/
│   │   └── order/
│   ├── utils/
│   ├── app.ts
│   └── server.ts
├── tests/
├── package.json
├── tsconfig.json
├── jest.config.js
├── .env
└── .gitignore
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@localhost:5432/bookstore_db"
JWT_SECRET="your-super-secret-jwt-key"
```

## Getting Started

```bash
# Clone the repository
git clone https://github.com/AbdelrahmanBadr7422/plot-twist-backend.git
cd plot-twist-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit with your database details

# Prepare the database
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed

# Start development server
npm run dev
# For production
npm run build && npm start
```

## Scripts

```bash
# Development
npm run dev
npm run build
npm start

# Database
npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
npm run prisma:studio

# Testing
npm test
npm run test:watch
npm run test:coverage
```

## API Endpoints

### Authentication

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| POST   | /api/auth/register | Register a new user      |
| POST   | /api/auth/login    | Login a user             |
| POST   | /api/auth/logout   | Logout a user            |
| GET    | /api/auth/profile  | Get current user profile |

### Books

| Method | Endpoint       | Description           |
| ------ | -------------- | --------------------- |
| GET    | /api/books     | List all books        |
| GET    | /api/books/:id | Get details of a book |
| POST   | /api/books     | Create a book (Admin) |
| PUT    | /api/books/:id | Update a book (Admin) |
| DELETE | /api/books/:id | Delete a book (Admin) |

### Orders

| Method | Endpoint               | Description                 |
| ------ | ---------------------- | --------------------------- |
| GET    | /api/orders/my-orders  | Get user's orders           |
| POST   | /api/orders            | Place a new order           |
| GET    | /api/orders/:id        | Get order details           |
| PUT    | /api/orders/:id/cancel | Cancel an order             |
| GET    | /api/orders            | List all orders (Admin)     |
| PUT    | /api/orders/:id/status | Update order status (Admin) |

## Sample Request

```bash
curl -X POST http://localhost:5000/api/auth/register \
-H 'Content-Type: application/json' \
-d '{"email":"user@bookstore.com","password":"user123"}'
```

## Sample Response

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "email": "user@bookstore.com"
  }
}
```

## Error Response

```json
{
  "success": false,
  "message": "Error description"
}
```

## Continuous Integration (CI)

This project uses GitHub Actions for simple CI. You can create a workflow in `.github/workflows/ci.yml` that prints messages or runs tests automatically on push or pull request.

Example simple workflow that prints a message:

```yaml
name: CI

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

```

## Deployment

```bash
# Build and start for production
npm run build
npm start

# Using PM2 for process management
npm install -g pm2
pm start dist/server.js --name "bookstore-api"
pm save
pm startup
```

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License

ISC License

## Contact

Abdelrahman Badr - [Linkedin](https://www.linkedin.com/in/abdelrahmanbadr74/)
[GitHub Repository](https://github.com/AbdelrahmanBadr7422/plot-twist-backend)

## Acknowledgments

* Express.js
* Prisma ORM
* TypeScript community
* Everyone who contributed to testing and feedback
