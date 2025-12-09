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
NEXT_PUBLIC_SITE_NAME=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_MAIL_ADDRESS=
NEXT_PUBLIC_TELEGRAM_LINK=
NEXT_PUBLIC_TELEGRAM_USERNAME=

NODE_ENV=

# Security (Cloudflare Turnstile)
NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY=
CLOUDFLARE_TURNSTILE_SECRET_KEY=

# Database
DATABASE_URL=

# Cloudflare R2 Configuration
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_ENDPOINT=
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

## Cloudflare Configuration

### 1. Geo-Restriction (WAF)
To restrict your domain to ONLY **Georgia** and **Germany**:

1.  Go to your **Cloudflare Dashboard** > **Security** > **WAF** > **Custom Rules**.
2.  Click **Create rule**.
3.  **Name**: "Geo Block" (or similar).
4.  **Field**: `Country`.
5.  **Operator**: `is not in` (or `does not equal` if selecting one).
6.  **Value**: Select `Georgia` and `Germany`.
7.  **Action**: `Block`.
8.  Click **Deploy**.

### 2. Cloudflare R2 Setup (Object Storage)
This project uses Cloudflare R2 for storing images and videos.

1.  **Create Bucket**:
    *   Go to **Cloudflare Dashboard** > **R2**.
    *   Click **Create Bucket**.
    *   Name it (e.g., `escort-directory-assets`).
    *   Click **Create Bucket**.

2.  **Enable Public Access** (Optional but recommended for assets):
    *   Go to **Settings** tab of your bucket.
    *   Under **Public Access**, allow access via Custom Domain or R2.dev subdomain if needed, though this app proxies uploads via API.
    *   **CORS Policy**: You may need to configure CORS if uploading directly from browser, but currently uploads go through the Next.js API.

3.  **Get Credentials**:
    *   Go to **R2 Overview** page (main R2 page).
    *   Click **Manage R2 API Tokens** (top right).
    *   Click **Create API Token**.
    *   **Permissions**: `Object Read & Write`.
    *   **Specific Bucket**: Select your new bucket.
    *   Click **Create API Token**.

4.  **Update `.env`**:
    Copy the values to your `.env` file:
    *   `R2_ACCOUNT_ID`: Found in the R2 dashboard sidebar or URL.
    *   `R2_ACCESS_KEY_ID`: From the API Token creation step.
    *   `R2_SECRET_ACCESS_KEY`: From the API Token creation step.
    *   `R2_BUCKET_NAME`: The name you gave your bucket.

