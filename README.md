# Imvera — Professional Image Gallery

Imvera is a secure, clean, and modern full-stack image management application. It provides standard production-grade SaaS features including user authentication, secure password reset, bulk image uploads with custom title assignments, responsive image grid view, inline file editing/replacements, bulk deletions, and interactive drag-and-drop reordering.

---

## Features

1. **User Authentication**: Secure user registration and login with bcrypt hashing and JWT token authorization.
2. **Password Reset**: Secure forgot-password/reset-password workflow utilizing time-expired token verification and mailer abstractions.
3. **Bulk Image Upload**: Simultaneous multiple file upload where every image has its own title input (database metadata sync with private S3 binary buckets).
4. **Interactive Dashboard**: Responsive SaaS layout with user avatars, safe router guards, and loading/error states.
5. **Drag-and-Drop Reordering**: Built with `dnd-kit` to allow local drag feedback before executing bulk database order saves.
6. **Asset Editing**: Inline name modification, S3 image replacement, and asset removal.

---

## Tech Stack

### Frontend
- **Core**: React 19, TypeScript, Vite
- **State & Data**: Redux Toolkit, Axios
- **Form Controls**: React Hook Form, Zod schemas
- **Styling**: Tailwind CSS v4 (minimal SaaS theme)
- **Drag-and-Drop**: `dnd-kit`

### Backend
- **Core**: Node.js, Express, TypeScript (native ESM with NodeNext resolution)
- **Database**: MongoDB, Mongoose ORM
- **Object Storage**: AWS S3 SDK v3
- **File Parsing**: Multer (configured for memory storage buffers)
- **Security**: bcryptjs, jsonwebtoken, dotenv, cors

---

## Architecture

The backend adheres strictly to **Clean Architecture** and **SOLID** principles:

```
backend/src/
├── common/           # Error classes, StatusCodes, Messages, and env configs
├── domain/           # Concept schemas, interfaces, and repository contracts
├── application/      # Use cases, interfaces, DTOs, and mapping logic
├── infrastructure/   # MongoDB models, repositories, S3 client, and Nodemailer
├── presentation/     # Route endpoints, validators, and slim controllers
└── main/             # Composition root and manual dependency injection
```

---

## Environment Variables

### Backend Configuration
Create a `.env` file in the `backend/` directory based on [backend/.env.example](file:///Users/nimishaks/Desktop/image-gallery/backend/.env.example):
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/imvera
JWT_SECRET=your_jwt_signing_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173

# AWS S3 Storage
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket_name

# SMTP Mail Server
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
```

### Frontend Configuration
Create a `.env` file in the `frontend/` directory based on `frontend/.env.example`:
```env
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## API Overview

### Authentication
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Sign in user and retrieve token
- `POST /api/auth/forgot-password` - Request password reset mail
- `POST /api/auth/reset-password` - Execute password reset using token
- `GET /api/auth/me` - Get currently authenticated user details

### Image Gallery (Protected routes)
- `POST /api/images` - Bulk upload images (FormData with `files` and `titles`)
- `GET /api/images` - List all user images (sorted by `order`)
- `GET /api/images/:id` - Fetch single image meta by ID
- `PUT /api/images/:id` - Update image title and/or replace image file in S3
- `DELETE /api/images/:id` - Delete image from MongoDB and S3 bucket
- `POST /api/images/reorder` - Persist new reordered ID list (`{ imageIds }`)

---

## Commands & Local Run

### Setup Dependencies
Install dependencies in both directories:
```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### Development Server
```bash
# Start backend on http://localhost:5001
cd backend && npm run dev

# Start frontend on http://localhost:5173
cd frontend && npm run dev
```

### Type Checking
```bash
# Backend
cd backend && npm run typecheck

# Frontend
cd frontend && npm run typecheck
```

---

## Deployment Considerations

1. **S3 Bucket Settings**: Use private bucket controls. Only expose objects via pre-signed HTTP URLs to secure assets from unauthorized direct links.
2. **CORS Settings**: Restrict client URLs inside Express CORS origin properties to production domains.
3. **SMTP Service**: Use secure services like Amazon SES, SendGrid, or custom secure SMTP servers on port 465 (SSL) / 587 (TLS).