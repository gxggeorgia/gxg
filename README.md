# Escort Directory Platform

A modern, scalable escort directory platform built with Next.js, Drizzle ORM, and PostgreSQL with multi-language support.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript
- **Styling:** TailwindCSS
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Internationalization:** next-intl (Georgian, English, Russian)
- **Authentication:** JWT-based custom auth
- **File Storage:** Cloudflare R2 (S3-compatible)

## Features

- Multi-language support (Georgian, English, Russian)
- Type-safe database schema with Drizzle ORM
- User roles (User, Escort, Admin)
- Profile management system
- Location-based organization (Cities & Districts)
- Image & video upload system (Cloudflare R2)
- Media management (upload, view, delete)
- Lightbox gallery with navigation
- Search & filtering 
- Gold/Silver profiles 

## Getting Started

For detailed installation and setup instructions, please refer to the [Setup Guide](SETUP_GUIDE.md).


## Database Schema

### Users Table
- User authentication and role management
- Support for User, Escort, and Admin roles
- Premium membership tracking

### Profiles Table
- Escort profile information
- Multi-language descriptions
- Photo and video storage
- Location (city/district)
- Verification and premium status
- Online status and activity tracking

### Locations Table
- City and district data
- Multi-language translations

## Internationalization

The app supports three locales:
- **Georgian (ka)** - Default
- **English (en)**
- **Russian (ru)**

Access different languages via URL:
- Georgian: `http://localhost:3000/ka`
- English: `http://localhost:3000/en`
- Russian: `http://localhost:3000/ru`

## File Storage (Cloudflare R2)

This project uses Cloudflare R2 for storing user-uploaded images and videos.

### Why Cloudflare R2?
- **Zero egress fees** - Unlimited free bandwidth
- **10 GB free storage**
- **S3-compatible API** - Easy to use
- **Private files** - Served through your domain only
- **Geo-restriction ready** - Control access by location

### Pricing
- **Storage**: $0.015/GB per month (after 10 GB free)
- **Downloads**: **FREE** (unlimited)
- **Uploads**: 1 million operations/month FREE

### File Access
Files are stored privately in R2 and served through `/api/media/[...path]` endpoint, ensuring:
- Domain-only access (no direct R2 URLs)
- Optional authentication/geo-restriction
- Bandwidth cost savings

## License

This project is private and proprietary.
