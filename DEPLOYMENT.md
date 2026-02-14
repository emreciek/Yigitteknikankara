# Deployment & Database Guide

## ⚠️ Common Prisma Errors
If you see `PrismaClientInitializationError`, it usually means:
1.  **File Lock**: SQLite `dev.db` is locked by another process (Studio, another terminal).
2.  **Schema Mismatch**: Your Prisma Client is out of sync with your database schema.

## 🛠️ Essential Commands

### `npx prisma generate`
**Use when:** You change `schema.prisma` or see initialization errors.
-   **What it does:** Generates the Javascript client code (`node_modules/@prisma/client`) based on your schema.
-   **Run this:** After every `npm install` or schema change.

### `npx prisma db push`
**Use when:** You want to update your local database structure.
-   **What it does:** Updates the SQLite file (`dev.db`) to match your schema.
-   **Use with caution:** Can cause data loss in development (it asks for confirmation).

## 🚀 Deployment Checklist (Vercel/Render)

1.  **Environment Variables**:
    -   Set `DATABASE_URL` in your platform's dashboard.
    -   Use `connection_limit=1` for SQLite/Postgres in serverless.

2.  **Build Command**:
    -   Ensure your build command includes client generation:
    -   `npx prisma generate && next build`

3.  **IP Whitelisting**:
    -   **Vercel**: Uses dynamic IPs. You must allow `0.0.0.0/0` (allow all) for your database if hosted externally (like MongoDB Atlas/Supabase).

## 💡 Performance Optimization
We have updated `lib/prisma.js` (Singleton Pattern) and `.env` (Connection Limits) to ensure stability.

## 🔴 CRITICAL: Setting Up PostgreSQL (Required)
The project has been switched to **PostgreSQL** for stability and compatibility with Vercel.

### 1. Create a Database (Vercel Postgres)
1.  Go to your **Vercel Dashboard**.
2.  Click **Storage** -> **Create Database** -> **Postgres**.
3.  Give it a name (e.g., `yigitteknik-db`) and region (e.g., `Frankfurt`).
4.  Once created, go to **.env.local** tab in the database page.
5.  Copy the `POSTGRES_PRISMA_URL` or `POSTGRES_URL_NON_POOLING`.

### 2. Update Environment Variables
**On Vercel:**
-   Go to Project Settings -> Environment Variables.
-   Add `DATABASE_URL` with the value you copied.

**Locally (for development):**
-   Open `.env` file in your project.
-   Replace the `DATABASE_URL` with your connection string.
-   Run `npx prisma db push` to create the tables in your new database.

### 3. Verify
-   Run `npm run dev`.
-   If it works, your migration is complete!
