# Data Integrasi Inovasi - Authentication & Role-Based Menu System

A robust Express.js REST API with authentication, role-based access control, and hierarchical menu management built with TypeScript, Prisma, and PostgreSQL.

## 🚀 Features

- **Authentication System**
  - User login with username/password
  - JWT-based authentication
  - Role selection for users with multiple roles
  
- **Role-Based Access Control (RBAC)**
  - Dynamic role management
  - User-role assignments
  - Menu-role assignments
  
- **Hierarchical Menu System**
  - Tree-structured menu organization
  - Role-based menu filtering
  - Parent-child menu relationships

- **Database Transactions**
  - All write operations wrapped in transactions
  - Automatic rollback on errors
  - Data integrity guarantees

- **Error Handling**
  - Centralized error middleware
  - Custom error classes
  - Zod validation with detailed error messages

## 📋 Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- pnpm (recommended) or npm

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:dikhiachmaddani/testdii.git
   cd dataintegrasiinovasi
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   ```bash
   cp example.env .env
   ```
   
   Edit `.env` and configure:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/express_db"
   JWT_ACCESS_TOKEN_SECRET_KEY="your-secret-key"
   JWT_REFRESH_TOKEN_SECRET_KEY="your-refresh-secret-key"
   JWT_ACCESS_TOKEN_EXPIRES_IN="1h"
   JWT_REFRESH_TOKEN_EXPIRES_IN="7d"
   PORT=3000
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Seed the database**
   ```bash
   npx prisma db seed
   ```

6. **Start development server**
   ```bash
   pnpm run dev
   ```

## 📊 Database Schema

```mermaid
erDiagram
    User ||--o{ UserRole : has
    Role ||--o{ UserRole : has
    Role ||--o{ RoleMenu : has
    Menu ||--o{ RoleMenu : has
    Menu ||--o{ Menu : "parent-child"

    User {
        uuid id PK
        string username UK
        string password
        timestamp createdAt
        timestamp updatedAt
    }

    Role {
        uuid id PK
        string name UK
        timestamp createdAt
        timestamp updatedAt
    }

    Menu {
        uuid id PK
        string name
        uuid parentId FK
        timestamp createdAt
        timestamp updatedAt
    }

    UserRole {
        uuid id PK
        uuid userId FK
        uuid roleId FK
        timestamp createdAt
        timestamp updatedAt
    }

    RoleMenu {
        uuid id PK
        uuid roleId FK
        uuid menuId FK
        timestamp createdAt
        timestamp updatedAt
    }
```

## 🔌 API Endpoints

### Authentication

#### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Get Data Successfully",
  "result": {
    "userId": "uuid",
    "roles": [
      { "id": "uuid", "name": "Admin" },
      { "id": "uuid", "name": "Manager" }
    ]
  }
}
```

#### Select Role
```http
POST /api/v1/auth/select-role
Content-Type: application/json

{
  "userId": "uuid",
  "roleId": "uuid"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Get Data Successfully",
  "result": {
    "accessToken": "jwt-token",
    "user": {
      "id": "uuid",
      "activeRole": {
        "roleId": "uuid",
        "roleName": "Admin"
      }
    }
  }
}
```

### Roles

#### Get All Roles
```http
GET /api/v1/roles
```

#### Create Role
```http
POST /api/v1/roles
Content-Type: application/json

{
  "name": "Manager"
}
```

#### Update Role
```http
PUT /api/v1/roles/:id
Content-Type: application/json

{
  "name": "Senior Manager"
}
```

#### Delete Role
```http
DELETE /api/v1/roles/:id
```

#### Assign Menu to Role
```http
POST /api/v1/roles/:roleId/menus
Content-Type: application/json

{
  "menuId": "uuid"
}
```

#### Remove Menu from Role
```http
DELETE /api/v1/roles/:roleId/menus/:menuId
```

#### Assign User to Role
```http
POST /api/v1/roles/:roleId/users
Content-Type: application/json

{
  "userId": "uuid"
}
```

#### Remove User from Role
```http
DELETE /api/v1/roles/:roleId/users/:userId
```

### Menus

#### Get All Menus (Tree Structure)
```http
GET /api/v1/menu
```

**Response:**
```json
{
  "status": 200,
  "message": "Get Data Successfully",
  "result": [
    {
      "id": "uuid",
      "name": "Dashboard",
      "parentId": null,
      "children": [
        {
          "id": "uuid",
          "name": "Analytics",
          "parentId": "parent-uuid",
          "children": []
        }
      ]
    }
  ]
}
```

#### Get Role Menus
```http
GET /api/v1/menu/role/:roleId
```

#### Create Menu
```http
POST /api/v1/menu
Content-Type: application/json

{
  "name": "Settings",
  "parentId": "uuid" // optional
}
```

#### Update Menu
```http
PUT /api/v1/menu/:id
Content-Type: application/json

{
  "name": "User Settings",
  "parentId": "uuid"
}
```

#### Delete Menu
```http
DELETE /api/v1/menu/:id
```

## 🏗️ Project Structure

```
src/
├── config/              # Configuration files
│   └── env.config.ts    # Environment variables
├── constant/            # Constants
│   └── http.constant.ts # HTTP status codes
├── controllers/         # Request handlers
│   ├── auth.controller.ts
│   ├── menu.controller.ts
│   └── role.controller.ts
├── dto/                 # Data Transfer Objects
│   ├── requests/        # Request DTOs
│   └── response/        # Response DTOs
├── middlewares/         # Express middlewares
│   ├── auth.middleware.ts
│   └── pre-response.middleware.ts
├── repositories/        # Data access layer
│   ├── implementations/
│   └── interfaces/
├── routes/              # API routes
│   ├── auth.routes.ts
│   ├── menu.routes.ts
│   ├── role.routes.ts
│   └── routes.ts
├── services/            # Business logic
│   ├── auth.service.ts
│   ├── menu.service.ts
│   └── role.service.ts
├── types/               # TypeScript types
├── utils/               # Utilities
│   ├── exceptions/      # Custom error classes
│   ├── prisma/          # Prisma client
│   ├── jwt.util.ts
│   ├── response.utils.ts
│   └── zod-validation.ts
└── server.ts            # Application entry point
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: Zod schema validation
- **SQL Injection Protection**: Prisma ORM parameterized queries
- **Error Sanitization**: No sensitive data in error responses

## 🧪 Testing

The project includes a Postman collection for API testing:
- Import `SANDBOX DII.postman_collection.json`
- Configure environment variables
- Run the collection

## 🐳 Docker Support

Build and run with Docker:

```bash
docker-compose up -d
```

## 📝 Development

### Code Quality
- **Linter**: Biome
- **Pre-commit Hooks**: Husky + lint-staged
- **Type Checking**: TypeScript strict mode

### Run Linter
```bash
pnpm run lint
```

### Format Code
```bash
npx biome check --write
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Dikhi Achmad Dani**

## 🙏 Acknowledgments

- Express.js for the web framework
- Prisma for the excellent ORM
- Zod for runtime validation
- JWT for authentication
