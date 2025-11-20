# MedSupply Manager - User Service

MedSupply Manager User Service is a backend service for managing users in the MedSupply system. It handles user registration, authentication, and role-based access control (Admin, Supplier, Pharmacies, Hospitals), as well as permission-based access to secure sensitive operations (sensitive products, orders, supplier management, etc.).

This service is designed with a focus on authentication, authorization, and code quality.

## Repository

https://github.com/MedSupply-Manager/user-service-

---
## Roles and Use Cases

The service manages several types of users:

### 1. System Administrator (admin)
- Manage all accounts and roles
- Supervise suppliers and orders
- Full system access

### 2. Supplier Admin (admin_fournisseur)
- Place orders with manufacturers
- Track order status
- Manage supplier information

### 3. Authorized Pharmacy (pharmacie_autorisee)
- Access to sensitive products
- Place normal and sensitive orders
- View catalog and order history

### 4. Standard Pharmacy (pharmacie_standard)
- Place normal product orders only
- View catalog and order history

### 5. Hospital (hopital)
- Manage hospital orders
- Access to specialized medical products
- View catalog and order history

Each user must authenticate through the user service before accessing features.
check use case diagramme 
---

## Project Structure

```
users/
├── .github/
│   └── workflows/
│       ├── build.yml           # GitHub Actions workflow for SonarQube scan
│       └── ci.yml              # CI/CD Pipeline
├── src/
│   ├── config/                 # Configuration (DB, JWT, etc.)
│   │   ├── db.js              # MongoDB Connection
│   │   ├── jwt.js             # JWT Utilities
│   │   └── index.js           # Configuration Exports
│   ├── controllers/            # Route Controllers
│   │   └── userController.js  # User Business Logic
│   ├── middlewares/            # Express Middlewares
│   │   ├── authMiddleware.js  # JWT Verification
│   │   ├── errorMiddleware.js # Error Handling
│   │   ├── rateLimit.js       # Rate Limiting
│   │   └── roleMiddleware.js  # Role Verification
│   ├── models/                 # Mongoose Models
│   │   ├── userModel.js       # User Schema
│   │   └── sessionModel.js    # Session Schema
│   ├── routes/                 # API Routes
│   │   └── userRoutes.js      # User Endpoints
│   ├── services/               # Business Logic
│   │   └── userService.js     # User Services
│   ├── utils/                  # Utility Functions
│   │   ├── logger.js          # Winston Logging
│   │   └── mail.js            # Email Utilities
│   ├── validations/            # Data Validation
│   │   └── userValidation.js  # Joi Schemas
│   └── server.js               # Entry Point
├── Test/
│   └── users.test.js           # Jest Tests
├── logs/                       # Application Logs
├── .env                        # Environment Variables
├── .gitignore                  # Git Ignored Files
├── jest.config.js              # Jest Configuration
├── package.json                # npm Dependencies
├── sonar-project.properties    # SonarCloud Configuration
└── README.md                   # Documentation
```

---

## Installation and Configuration

### Prerequisites

- Node.js v18+ installed
- MongoDB v6+ installed and running
- Git installed

### 1. Clone the Repository

```bash
git clone https://github.com/MedSupply-Manager/user-service-.git
cd user-service-
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file at the root of the project:

```env
# Server
PORT=5001
NODE_ENV=development

# Frontend
FRONTEND_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb://localhost:27017/users_db

# JWT Secrets (Generate secure secrets for production)
JWT_ACCESS_SECRET=your_secure_access_secret_here
JWT_REFRESH_SECRET=your_secure_refresh_secret_here
JWT_EMAIL_SECRET=your_secure_email_secret_here
JWT_PASSWORD_RESET_SECRET=your_secure_reset_secret_here

# JWT Configuration
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d
JWT_ALGORITHM=HS256

# Email Configuration (Mailtrap)
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_password
EMAIL_FROM="MedSupply Manager <noreply@medsupply.local>"

# Security
BCRYPT_ROUNDS=12
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=30
```

**Important Security Notes:**
- Replace all JWT secrets with strong, randomly generated secrets in production
- Use a secure SMTP service for production (not Mailtrap)
- Never commit the `.env` file to version control

### 4. Start MongoDB

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

### 5. Launch the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server starts on: http://localhost:5001

---

## API Endpoints

### Public Routes

**POST** `/api/users/register` - Register a new user  
**POST** `/api/users/login` - User login  
**GET** `/api/users/verify-email/:token` - Verify email  
**POST** `/api/users/forgot-password` - Request password reset  
**POST** `/api/users/reset-password` - Reset password  
**POST** `/api/users/refresh-token` - Refresh access token  
**GET** `/api/users/verify-token` - Verify current token  
**GET** `/api/users/health` - Health check endpoint  

### Protected Routes (Requires Authentication)

**POST** `/api/users/logout` - User logout  
**GET** `/api/users/profile` - Get user profile  

### Admin-Only Routes

**GET** `/api/users/` - Get all users  
**GET** `/api/users/:id` - Get user by ID  
**PUT** `/api/users/:id` - Update user  
**DELETE** `/api/users/:id` - Deactivate user  
**GET** `/api/users/admin/dashboard` - Admin dashboard  

---

## Testing

### Run Tests

```bash
# All tests
npm test

# With coverage
npm run test:coverage
```

### Test with Postman

Postman workspace available at:  
https://silmihadjer.postman.co/workspace/stock-managment~d0857ac6-5832-4180-a1f7-cea02648758a/request/45178617-cde26ca8-bf0b-4a6d-90e5-833768227689?action=share&creator=45178617&ctx=documentation

---

## CI/CD Pipeline

The project includes automated GitHub Actions workflows:

### CI Pipeline (.github/workflows/ci.yml)
- Runs on every push and pull request
- Executes automated tests
- Validates code quality

### SonarQube Analysis (.github/workflows/build.yml)
- Code quality and security analysis
- Coverage reporting
- Technical debt tracking

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Start production server
npm start

# Run tests
npm test


---
