# Imvera

Imvera is a full-stack image management application that allows users to securely manage, organize, and maintain their image collections.

## Current Features

- User registration
- User login
- JWT-based authentication
- Protected routes
- MongoDB persistence
- Password hashing with bcrypt
- AWS S3 storage integration foundation
- Multer configuration for image uploads
- Responsive React frontend
- Redux Toolkit state management
- Form validation with React Hook Form and Zod

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- React Hook Form
- Zod

### Backend

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcryptjs
- AWS S3
- Multer

## Architecture

The backend follows Clean Architecture and SOLID principles.


backend/
└── src/
    ├── common/
    ├── domain/
    ├── application/
    ├── infrastructure/
    ├── presentation/
    └── main/