# Development Notes

## Project Overview

This is an escort directory platform built with modern web technologies, designed to replace a WordPress-based system with a scalable, performant solution.

## Technology Decisions

### Why Next.js 15?
- **App Router**: Modern routing with React Server Components
- **Performance**: Built-in image optimization, code splitting
- **SEO**: Server-side rendering for better search engine visibility
- **Developer Experience**: Hot reload, TypeScript support, great tooling

### Why Drizzle ORM?
- **Type Safety**: Full TypeScript support with inferred types
- **Performance**: Lightweight, no runtime overhead
- **SQL-like**: Easy to learn if you know SQL
- **Migrations**: Built-in migration system with drizzle-kit
- **Developer Tools**: Drizzle Studio for visual database management

### Why PostgreSQL?
- **Reliability**: ACID compliant, battle-tested
- **Features**: JSON support, full-text search, advanced indexing
- **Scalability**: Handles millions of records efficiently
- **Extensions**: PostGIS for location features (future)

### Why next-intl?
- **Type Safety**: TypeScript support for translations
- **Performance**: Server-side rendering compatible
- **Features**: Pluralization, number/date formatting
- **Developer Experience**: Easy to use, well documented

## Database Schema Design

### Users Table
```typescript
- id: UUID (primary key)
- email: Unique identifier for login
- password: Hashed with bcrypt (future)
- role: Enum (user, escort, admin)
- isVerified: Email verification status
- isPremium: Premium membership status
- premiumUntil: Premium expiration date
- lastActive: Track user activity
- createdAt, updatedAt: Timestamps
```

### Profiles Table
```typescript
- id: UUID (primary key)
- userId: Foreign key to users
- name: Display name
- gender: Enum (female, male, transsexual)
- city, district: Location data
- description: JSONB for multi-language support
- photos, videos: Arrays of URLs
- isVerified: Verification badge
- isPremium: Premium profile status
- isOnline: Real-time online status
- viewCount: Profile views counter
- contactInfo: JSONB for flexible contact methods
- lastActive: Last profile activity
- boostUntil: Profile boost expiration
- createdAt, updatedAt: Timestamps
```

### Locations Table
```typescript
- id: UUID (primary key)
- city: City identifier (slug)
- districts: Array of district identifiers
- translations: JSONB for multi-language names
- createdAt, updatedAt: Timestamps
```

## Internationalization Strategy

### Locale Structure
- **Georgian (ka)**: Default locale, primary market
- **English (en)**: International users
- **Russian (ru)**: Secondary market

### URL Structure
- All routes prefixed with locale: `/ka/`, `/en/`, `/ru/`
- Automatic locale detection via middleware
- Cookie-based locale persistence

### Translation Files
- JSON files in `/messages/` directory
- Nested structure for organization
- Shared common translations

## Future Features Roadmap

### Phase 2: Core Features
1. **Authentication System**
   - NextAuth.js integration
   - Email/password login
   - Social login (Google, Facebook)
   - Email verification
   - Password reset

2. **Profile Management**
   - Create/edit profile form
   - Image upload with Cloudinary
   - Video upload support
   - Profile preview
   - Profile deletion

3. **Search & Filtering**
   - Full-text search
   - Filter by city, district, gender
   - Filter by VIP/verified status
   - Sort by: newest, most viewed, online
   - Pagination

4. **Image Upload**
   - Cloudinary integration
   - Image optimization
   - Multiple image upload
   - Drag & drop interface
   - Image cropping

### Phase 3: Premium Features
1. **Payment Integration**
   - Stripe integration
   - Subscription plans
   - One-time payments for boosts
   - Payment history
   - Invoice generation

2. **VIP/Premium Profiles**
   - Premium badge display
   - Top placement in listings
   - More photos allowed
   - Video support
   - Featured on homepage

3. **Profile Boost System**
   - Temporary top placement
   - Boost duration options (24h, 7d, 30d)
   - Boost history
   - Auto-renewal option

4. **Verification System**
   - Photo verification
   - ID verification (admin)
   - Verification badge
   - Trust score

### Phase 4: Advanced Features
1. **Real-time Features**
   - Online status (Socket.io)
   - Live chat between users
   - Notifications
   - Real-time profile updates

2. **Analytics**
   - Profile view tracking
   - Search analytics
   - User behavior tracking
   - Admin dashboard

3. **SEO Optimization**
   - Dynamic meta tags
   - Structured data (Schema.org)
   - Sitemap generation
   - robots.txt
   - Open Graph tags

4. **Admin Panel**
   - User management
   - Profile moderation
   - Content moderation
   - Analytics dashboard
   - Payment management

## Security Considerations

### Authentication
- Use bcrypt for password hashing
- Implement rate limiting on login
- Add CSRF protection
- Use secure session management

### Data Protection
- Validate all user inputs
- Sanitize data before database insertion
- Use parameterized queries (Drizzle handles this)
- Implement proper CORS policies

### File Uploads
- Validate file types and sizes
- Scan for malware
- Use CDN for serving files
- Implement upload rate limiting

### Privacy
- GDPR compliance
- Data deletion requests
- Privacy policy
- Cookie consent
- Age verification

## Performance Optimization

### Frontend
- Image optimization with Next.js Image
- Code splitting
- Lazy loading
- Caching strategies
- CDN for static assets

### Backend
- Database indexing
- Query optimization
- Connection pooling
- Caching with Redis (future)
- Rate limiting

### Database
- Index on frequently queried fields
- Optimize JSONB queries
- Use database views for complex queries
- Regular VACUUM and ANALYZE

## Deployment Strategy

### Recommended Setup
- **Frontend**: Vercel (Next.js optimized)
- **Database**: Neon or Supabase (PostgreSQL)
- **File Storage**: Cloudinary or AWS S3
- **Email**: SendGrid or Resend
- **Analytics**: Vercel Analytics or Google Analytics

### Environment Variables
- Use different .env files for dev/staging/prod
- Never commit .env files
- Use Vercel's environment variables UI
- Rotate secrets regularly

### CI/CD
- GitHub Actions for automated testing
- Automated deployments on merge to main
- Preview deployments for PRs
- Database migrations in deployment pipeline

## Testing Strategy

### Unit Tests
- Test utility functions
- Test database queries
- Test API routes

### Integration Tests
- Test user flows
- Test payment integration
- Test email sending

### E2E Tests
- Use Playwright or Cypress
- Test critical user journeys
- Test on multiple browsers

## Code Organization

### Directory Structure
```
src/
├── app/              # Next.js app router
│   └── [locale]/     # Localized routes
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── features/    # Feature-specific components
├── db/              # Database
│   ├── schema.ts    # Drizzle schema
│   ├── index.ts     # DB connection
│   └── seed.ts      # Seed data
├── i18n/            # Internationalization
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
└── types/           # TypeScript types
```

### Naming Conventions
- **Components**: PascalCase (e.g., `ProfileCard.tsx`)
- **Files**: kebab-case (e.g., `user-profile.ts`)
- **Functions**: camelCase (e.g., `getUserProfile`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

## Git Workflow

### Branch Strategy
- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `bugfix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

### Commit Messages
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

## Monitoring & Logging

### Error Tracking
- Sentry for error monitoring
- Log errors with context
- Alert on critical errors

### Performance Monitoring
- Vercel Analytics
- Core Web Vitals tracking
- Database query performance

### Logging
- Structured logging
- Log levels (debug, info, warn, error)
- Log rotation
- Centralized logging (future)

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and optimize database queries
- Clean up unused code
- Update documentation
- Security audits

### Database Maintenance
- Regular backups
- Monitor database size
- Optimize slow queries
- Update statistics

## Resources

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [next-intl Docs](https://next-intl-docs.vercel.app)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Community
- Next.js Discord
- Drizzle Discord
- Stack Overflow

### Tools
- Drizzle Studio: Database GUI
- Vercel Dashboard: Deployment & analytics
- Postman: API testing
- pgAdmin: PostgreSQL management
