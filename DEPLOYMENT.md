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
