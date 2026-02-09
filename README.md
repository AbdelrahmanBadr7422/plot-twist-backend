# Plot Twist - Book Store API

A production-ready RESTful backend API for a book store management system. This project demonstrates modern backend development practices with authentication, authorization, and comprehensive testing.

## 🚀 Features

- **User Authentication & Authorization**
  - JWT-based authentication with secure cookie handling
  - Role-based access control (USER/ADMIN)
  - Password hashing with bcrypt

- **Book Management**
  - Full CRUD operations for book catalog
  - Stock management
  - Admin-only book creation, update, and deletion

- **Order Processing**
  - Create orders with multiple items
  - Automatic stock deduction
  - Transaction-based order processing
  - User order history
  - Admin order management

- **API Design**
  - RESTful API architecture
  - Request validation with Zod
  - Centralized error handling
  - Standardized API responses

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Testing**: Jest, Supertest
- **Password Hashing**: bcrypt

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd plot-twist-backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with:
```
DATABASE_URL="postgresql://user:password@localhost:5432/plot_twist"
JWT_SECRET="your-secret-key-here"
PORT=3000
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Generate Prisma Client:
```bash
npx prisma generate
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## 🧪 Testing

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books (Public)
- `GET /api/books/:id` - Get book by ID (Public)
- `POST /api/books` - Create book (Admin only)
- `PUT /api/books/:id` - Update book (Admin only)
- `DELETE /api/books/:id` - Delete book (Admin only)

### Orders
**User Endpoints (Authenticated users can manage their own orders):**
- `POST /api/orders` - Create a new order
- `GET /api/orders/me` - Get all my orders
- `GET /api/orders/me/:id` - Get one of my orders by ID
- `PUT /api/orders/me/:id` - Update one of my orders
- `DELETE /api/orders/me/:id` - Delete one of my orders

**Admin Endpoints (Admins can manage all orders):**
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/:id` - Get any order by ID (Admin only)
- `DELETE /api/orders/:id` - Delete any order (Admin only)

### Health Check
- `GET /api/health` - Health check endpoint

## 📁 Project Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts              # Server entry point
├── routes.ts              # Main router
├── config/                # Configuration files
│   ├── env.ts            # Environment variables
│   └── prisma.ts         # Prisma client
├── middlewares/           # Express middlewares
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── role.middleware.ts
│   └── validation.middleware.ts
├── modules/               # Feature modules
│   ├── auth/             # Authentication module
│   ├── book/             # Book management module
│   └── order/            # Order management module
└── utils/                 # Utility functions
    ├── api-response.ts
    ├── app-error.ts
    ├── hash.ts
    └── jwt.ts
tests/                      # Test files
prisma/                     # Prisma schema and migrations
```

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- HTTP-only cookies for token storage
- Input validation with Zod schemas
- Role-based access control
- SQL injection prevention (Prisma ORM)

## 📝 Author

**Abdelrahman**

Fresh graduate developer passionate about building scalable and maintainable backend systems.

## 📄 License

ISC
