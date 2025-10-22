# Escort Directory Platform

A modern, scalable escort directory platform built with Next.js, Drizzle ORM, and PostgreSQL with multi-language support.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript
- **Styling:** TailwindCSS
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Internationalization:** next-intl (Georgian, English, Russian)
- **Authentication:** NextAuth.js (planned)
- **File Upload:** Cloudinary (planned)

## 📋 Features

- ✅ Multi-language support (Georgian, English, Russian)
- ✅ Type-safe database schema with Drizzle ORM
- ✅ User roles (User, Escort, Admin)
- ✅ Profile management system
- ✅ Location-based organization (Cities & Districts)
- 🔄 Search & filtering (planned)
- 🔄 Premium/VIP profiles (planned)
- 🔄 Image upload system (planned)
- 🔄 Payment integration (planned)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**
```bash
cd escort-directory
npm install
```

2. **Set up environment variables:**
```bash
cp env.example .env.local
```

Edit `.env.local` and add your PostgreSQL connection string:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/escort_directory
```

3. **Set up the database:**
```bash
# Generate migration files
npm run db:generate

# Push schema to database
npm run db:push
```

4. **Run the development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
escort-directory/
├── src/
│   ├── app/
│   │   └── [locale]/          # Localized routes
│   │       ├── layout.tsx     # Root layout with i18n
│   │       └── page.tsx       # Homepage
│   ├── db/
│   │   ├── index.ts           # Database connection
│   │   └── schema.ts          # Drizzle schema definitions
│   ├── i18n/
│   │   ├── request.ts         # i18n request config
│   │   └── routing.ts         # Locale routing config
│   └── middleware.ts          # Locale detection middleware
├── messages/
│   ├── en.json                # English translations
│   ├── ka.json                # Georgian translations
│   └── ru.json                # Russian translations
├── drizzle.config.ts          # Drizzle Kit configuration
└── package.json
```

## 🗄️ Database Schema

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

## 🌍 Internationalization

The app supports three locales:
- **Georgian (ka)** - Default
- **English (en)**
- **Russian (ru)**

Access different languages via URL:
- Georgian: `http://localhost:3000/ka`
- English: `http://localhost:3000/en`
- Russian: `http://localhost:3000/ru`

## 📜 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database commands
npm run db:generate  # Generate migration files
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## 🔐 Environment Variables

See `env.example` for all required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Application URL (for authentication)
- `NEXTAUTH_SECRET` - Secret key for NextAuth
- Cloudinary credentials (for file uploads)
- SMTP settings (for emails)

## 🚧 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Database schema
- [x] Multi-language support

### Phase 2: Core Features (In Progress)
- [ ] Authentication system
- [ ] Profile creation & management
- [ ] Search & filtering
- [ ] Image upload

### Phase 3: Premium Features
- [ ] Payment integration
- [ ] VIP/Premium profiles
- [ ] Profile boost system
- [ ] Verification system

### Phase 4: Polish & Launch
- [ ] SEO optimization
- [ ] Performance optimization
- [ ] Testing
- [ ] Deployment

## 📝 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contact the project owner for contribution guidelines.
