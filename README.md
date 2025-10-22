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

## 📋 Features

- ✅ Multi-language support (Georgian, English, Russian)
- ✅ Type-safe database schema with Drizzle ORM
- ✅ User roles (User, Escort, Admin)
- ✅ Profile management system
- ✅ Location-based organization (Cities & Districts)
- ✅ Image & video upload system (Cloudflare R2)
- ✅ Media management (upload, view, delete)
- ✅ Lightbox gallery with navigation
- 🔄 Search & filtering (planned)
- 🔄 Premium/VIP profiles (planned)
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

Create a `.env` file in the root directory with the following variables:

```env
# Site Configuration
NEXT_PUBLIC_SITE_NAME=YourSiteName

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/escort_directory

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your_account_id.r2.cloudflarestorage.com
```

**How to get Cloudflare R2 credentials:**

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** in the left sidebar
3. Click **Create bucket** and name it (e.g., `eg-media`)
4. Click **Manage R2 API Tokens**
5. Click **Create API Token** (choose "Account API Tokens" for production)
6. Configure:
   - **Token name**: `your-app-name-production`
   - **Permissions**: Object Read & Write
   - **Bucket**: Select your bucket or "Apply to all buckets"
7. Click **Create API Token**
8. **IMPORTANT**: Copy these values immediately (shown only once):
   - **Access Key ID** → Use for `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → Use for `R2_SECRET_ACCESS_KEY`
   - **Endpoint URL** → Extract account ID for `R2_ACCOUNT_ID`
9. Update your `.env` file with these credentials

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

Required environment variables:

### Database
- `DATABASE_URL` - PostgreSQL connection string

### Cloudflare R2 (File Storage)
- `R2_ACCOUNT_ID` - Your Cloudflare account ID
- `R2_ACCESS_KEY_ID` - R2 API access key
- `R2_SECRET_ACCESS_KEY` - R2 API secret key
- `R2_BUCKET_NAME` - Your R2 bucket name
- `R2_PUBLIC_URL` - R2 endpoint URL

### Site Configuration
- `NEXT_PUBLIC_SITE_NAME` - Your site name

## 💾 File Storage (Cloudflare R2)

This project uses Cloudflare R2 for storing user-uploaded images and videos.

### Why Cloudflare R2?
- ✅ **Zero egress fees** - Unlimited free bandwidth
- ✅ **10 GB free storage**
- ✅ **S3-compatible API** - Easy to use
- ✅ **Private files** - Served through your domain only
- ✅ **Geo-restriction ready** - Control access by location

### Pricing
- **Storage**: $0.015/GB per month (after 10 GB free)
- **Downloads**: **FREE** (unlimited)
- **Uploads**: 1 million operations/month FREE

### File Access
Files are stored privately in R2 and served through `/api/media/[...path]` endpoint, ensuring:
- Domain-only access (no direct R2 URLs)
- Optional authentication/geo-restriction
- Bandwidth cost savings

## 🚧 Development Roadmap

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Database schema
- [x] Multi-language support

### Phase 2: Core Features ✅
- [x] Authentication system
- [x] Profile creation & management
- [x] Image & video upload (Cloudflare R2)
- [x] Media management
- [ ] Search & filtering

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
