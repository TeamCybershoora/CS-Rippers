---
description: Repository Information Overview
alwaysApply: true
---

# CS-Rippers Information

## Summary
CS-Rippers is a Next.js web application that provides a platform with user authentication, admin panel, and dashboard functionality. The application features a modern UI with MacOS-inspired design elements, GSAP animations, and performance optimizations. It includes user registration, login functionality, and an admin panel for managing users, events, leaderboards, and themes.

## Structure
- **src/app**: Main application code with pages, components, and API routes
- **src/hooks**: Custom React hooks for animations and performance
- **src/lib**: Utility libraries for MongoDB and email functionality
- **src/styles**: CSS files for styling different parts of the application
- **public**: Static assets including images and SVG files

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: TypeScript 5.8.3
**Build System**: Next.js 15.4.4
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- next: ^15.4.4 - React framework
- react: ^19.1.0 - UI library
- react-dom: ^19.1.0 - DOM bindings for React
- mongodb: ^6.18.0 - MongoDB driver
- bcryptjs: ^3.0.2 - Password hashing
- nodemailer: ^7.0.5 - Email sending
- gsap: ^3.13.0 - Animation library
- critters: ^0.0.23 - CSS inlining

**Development Dependencies**:
- typescript: 5.8.3
- eslint: ^9
- tailwindcss: ^4
- @types/react: 19.1.8
- @types/node: 20.19.9

## Build & Installation
```bash
# Install dependencies
npm install

# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Database
**Type**: MongoDB
**Connection**: Environment variable `MONGODB_URI`
**Configuration**: Connection pooling with development/production environment detection

## Email System
**Service**: Gmail
**Configuration**: Uses nodemailer with environment variables `EMAIL_USER` and `EMAIL_PASS`
**Features**: Email templates, retry logic with exponential backoff, verification

## Authentication
**Method**: Custom authentication with bcryptjs for password hashing
**API Routes**: 
- /api/login
- /api/register
- /api/verify-otp
- /api/admin/auth

## Main Components
**Frontend**:
- MacOS-inspired UI (MacOSDock, MacOSMenuBar)
- Admin panel with dashboard, user management, events, leaderboard, and theme management
- GSAP animations for enhanced user experience
- Performance-optimized layouts and image components

**Backend**:
- API routes for authentication, email testing, and admin functionality
- MongoDB integration for data persistence
- Email service for notifications and OTP verification

## Performance Optimizations
- CSS optimization with critters
- Package import optimization
- Image optimization with WebP and AVIF formats
- Caching headers for static assets
- Code splitting with webpack configuration