# Overview

This is a full-stack web application called "TikCreator AI" - a Vietnamese-language platform for managing products and generating AI-powered TikTok marketing videos. The application allows users to upload products, automatically generate video content with trending hashtags, and track analytics for their TikTok marketing campaigns.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Full-Stack TypeScript Application
- **Frontend**: React with TypeScript using Vite as the build tool
- **Backend**: Express.js server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: shadcn/ui components with Tailwind CSS
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

### Directory Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared TypeScript schemas and types
- `migrations/` - Database migration files

## Key Components

### Frontend Architecture
- **Component Structure**: Organized into feature-based directories (`dashboard`, `products`, `analytics`, `ai`)
- **UI Components**: shadcn/ui component library with custom styling
- **Styling**: Tailwind CSS with TikTok brand colors and theming
- **State Management**: React Query for API calls and caching
- **Form Handling**: React Hook Form with Zod validation
- **Responsive Design**: Mobile-first approach with dedicated mobile components

### Backend Architecture
- **API Structure**: RESTful endpoints organized in `/api/*` routes
- **Storage Layer**: PostgreSQL database with Drizzle ORM and abstracted storage interface
- **Database**: Full PostgreSQL integration with automated schema migrations
- **File Upload**: Multer middleware for handling image uploads
- **Error Handling**: Centralized error handling middleware
- **Logging**: Custom request logging for API endpoints

### Database Schema
- **Products**: Store product information including name, price, description, images, and features
- **Videos**: Generated video content with metadata, hashtags, and performance tracking
- **Hashtags**: Trending hashtag management with view counts and categories
- **Users**: Basic user authentication structure

## Data Flow

1. **Product Management**: Users add products through forms, images are uploaded to server storage
2. **AI Video Generation**: Products are processed to generate video scripts and hashtag recommendations
3. **Analytics Tracking**: Video performance metrics are collected and displayed in dashboard
4. **Hashtag Trending**: System tracks and displays trending hashtags for video optimization

## External Dependencies

### Core Framework Dependencies
- React 18 with TypeScript
- Express.js for server
- Drizzle ORM with PostgreSQL driver (@neondatabase/serverless)
- Vite for frontend build tooling

### UI and Styling
- shadcn/ui component library with Radix UI primitives
- Tailwind CSS for styling
- Lucide React for icons

### Data Management
- TanStack React Query for API state management
- React Hook Form for form handling
- Zod for schema validation

### Development Tools
- TypeScript for type safety
- ESBuild for server bundling
- Replit-specific development plugins

## Deployment Strategy

### Development Environment
- Vite dev server for frontend with HMR
- Express server with tsx for TypeScript execution
- File-based asset storage in `uploads/` directory

### Production Build
- Frontend: Vite builds to `dist/public/`
- Backend: ESBuild bundles server to `dist/index.js`
- Static file serving integrated with Express

### Database Configuration
- Uses Drizzle ORM with PostgreSQL
- Connection via `DATABASE_URL` environment variable
- Schema migrations managed through `drizzle-kit`

### Key Features
- Bilingual interface (Vietnamese/English)
- TikTok-inspired design with brand colors
- Real-time analytics dashboard
- AI-powered content generation workflow
- Mobile-responsive design
- File upload functionality for product images
- Trending hashtag tracking system
- **iOS App Export**: Capacitor integration for native iOS app deployment

### iOS App Development
- **Capacitor Setup**: Configured for iOS native app conversion
- **App Configuration**: Bundle ID `com.tikcreator.app`, TikTok brand splash screen
- **Build Requirements**: Apple Developer Account ($99/year), Mac with Xcode
- **Export Process**: Detailed guide in `IOS_BUILD_GUIDE.md`

### Recent Changes (July 31, 2025)
- ✓ Added PostgreSQL database integration with full persistence
- ✓ Configured Capacitor for iOS app export capability
- ✓ Fixed product creation form validation issues
- ✓ Created comprehensive iOS build documentation
- ✓ Set up native mobile app structure for .ipa generation