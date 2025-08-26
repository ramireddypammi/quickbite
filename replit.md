# Overview

This is a full-stack food delivery application called "QuickBite" built with a modern tech stack. The application allows users to browse restaurants, view menus, add items to a shopping cart, place orders, and track delivery status. It features a React frontend with TypeScript, an Express.js backend, and PostgreSQL database with Drizzle ORM for data management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client-side is built with React and TypeScript using Vite as the build tool. The frontend follows a component-based architecture with:

- **UI Components**: Uses shadcn/ui component library built on Radix UI primitives for consistent, accessible components
- **Styling**: Tailwind CSS for utility-first styling with CSS custom properties for theming
- **State Management**: React Context API for global state (authentication, shopping cart)
- **Data Fetching**: TanStack Query for server state management and caching
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

The application structure separates concerns with dedicated directories for components, pages, hooks, and utilities. The cart and authentication systems are implemented as React Context providers to share state across components.

## Backend Architecture
The server follows a RESTful API design using Express.js:

- **Route Organization**: Centralized route registration with modular endpoint handlers
- **Data Storage**: Currently uses in-memory storage with plans for PostgreSQL migration using Drizzle ORM
- **API Structure**: RESTful endpoints for authentication, restaurants, menu items, and orders
- **Error Handling**: Centralized error handling middleware
- **Development Tools**: Hot reloading with Vite integration for development

The backend uses a storage abstraction pattern that allows switching between in-memory storage (for development) and database storage without changing business logic.

## Data Storage
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations:

- **Schema Definition**: Centralized schema in TypeScript using Drizzle's column definitions
- **Database Tables**: Users, restaurants, menu items, orders, and order items
- **Type Safety**: Full TypeScript integration from database to frontend
- **Migrations**: Drizzle Kit for database migrations and schema management

## Authentication and Authorization
Basic authentication system implemented with:

- **User Registration/Login**: Simple email/password authentication
- **Session Management**: Currently using basic validation without JWT tokens
- **Protected Routes**: Client-side route protection based on authentication state
- **User Context**: React Context for managing user state across the application

The current implementation is simplified but provides the foundation for more robust authentication systems.

# External Dependencies

## Frontend Dependencies
- **React Ecosystem**: React 18 with TypeScript, React Hook Form, React Query
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with PostCSS for processing
- **Build Tools**: Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **Validation**: Zod for runtime type checking and validation

## Backend Dependencies
- **Runtime**: Node.js with Express.js framework
- **Database**: PostgreSQL with Neon serverless driver (@neondatabase/serverless)
- **ORM**: Drizzle ORM for type-safe database operations
- **Development**: tsx for TypeScript execution, esbuild for production builds
- **Session Storage**: connect-pg-simple for PostgreSQL session storage

## Development Tools
- **TypeScript**: Full type safety across the stack
- **ESM Modules**: Modern ES module system throughout
- **Hot Reloading**: Vite development server with HMR
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Replit Integration**: Custom plugins for Replit development environment

## Database Configuration
- **Primary Database**: PostgreSQL (configured for Neon serverless)
- **Connection**: Environment variable-based configuration (DATABASE_URL)
- **Schema Management**: Drizzle migrations in dedicated migrations directory
- **Type Generation**: Automatic TypeScript types from database schema

The application is designed to be deployed on cloud platforms with PostgreSQL database support, with current configuration optimized for Neon's serverless PostgreSQL offering.