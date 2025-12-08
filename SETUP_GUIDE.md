# Setup Guide

## Quick Start

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Setup**
    Create a `.env` file in the root directory and fill in the required values (see below).

3.  **Database Setup**
    ```bash
    npm run db:push
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```

## Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# Site Configuration
NEXT_PUBLIC_SITE_NAME="GogoXGeorgia"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_MAIL_ADDRESS="contact@gogoxgeorgia.ge"
NEXT_PUBLIC_TELEGRAM_LINK="https://t.me/gogoxgeorgia"
NEXT_PUBLIC_TELEGRAM_USERNAME="@gogoxgeorgia"

NODE_ENV="development"

# Security (Cloudflare Turnstile)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY="your-site-key"
CLOUDFLARE_TURNSTILE_SECRET_KEY="your-secret-key"

# Database
DATABASE_URL="postgresql://user:password@host:port/dbname"

# Cloudflare R2 Configuration
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key-id"
R2_SECRET_ACCESS_KEY="your-secret-access-key"
R2_BUCKET_NAME="your-bucket-name"
R2_ENDPOINT="https://your-account-id.r2.cloudflarestorage.com"
```

## Available Scripts

### Core
-   `npm run dev`: Start development server with Turbopack
-   `npm run build`: Build for production
-   `npm run start`: Start production server
-   `npm run lint`: Run ESLint

### Database Management
-   `npm run db:push`: Push schema changes to database
-   `npm run db:studio`: Open Drizzle Studio (database GUI)
-   `npm run db:generate`: Generate migration files
-   `npm run db:migrate`: Run migrations
-   `npm run db:seed`: Seed the database with initial data
-   `npm run db:nuke`: **WARNING** Completely wipe and reset the database
-   `npm run db:admin`: Create an admin user

## Troubleshooting

-   **Database Errors**: Ensure your database connection string is correct and your IP is allowed if using a cloud database. Run `npm run db:push` to ensure the schema is synced.
-   **Images not loading**: Check your Cloudflare R2 credentials and bucket CORS settings.
-   **Login Issues**: Ensure `NEXTAUTH_SECRET` and `NEXTAUTH_URL` are set correctly.
