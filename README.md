# AasaMedChem Assignment

A complete inventory and order management system built with Next.js, Neon PostgreSQL, Prisma, NextAuth, and Tailwind CSS (shadcn/ui). This project was designed to fulfill the Hackathon Assignment requirements for AasaMedChem.

## Features & Project Overview
- **Dark-Theme UI**: Built with Shadcn UI and `next-themes` using modern aesthetics.
- **Neon PostgreSQL**: Edge-ready serverless database integration using the `pg` adapter.
- **NextAuth**: Role-based authentication (`ADMIN` and `SELLER`).
- **MedChem Edge Functionality**: Domain-specific product tracking (Hazard Class, Storage Conditions).
- **Dynamic Quotation Builder**: Automatic price calculation and unit conversion (e.g. converting Liters to base unit mL dynamically).
- **Admin Dashboard**: View inventory, add new chemical products, and view incoming orders with precise conversion details.

## Tech Stack & High-Level System Design
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Shadcn UI.
- **Backend**: Next.js Server Actions handle business logic (creating products, calculating orders) securely on the server.
- **Database**: Neon PostgreSQL accessed via Prisma ORM (`@prisma/adapter-pg` ensures smooth connection pooling).
- **Architecture**: The frontend interfaces directly with Server Actions, which communicate with Prisma. Database connections are handled via WebSockets (`pg` driver) to bypass standard serverless cold-start limitations.

## Unit Storage & Conversion Strategy
Handling scientific and chemical units requires precision and consistency.

1. **Internal Storage (Base Units)**:
   - All products have a strictly defined `dimension` (WEIGHT, VOLUME, COUNT).
   - Every product defines a `baseUnit` (e.g., `mL` for volume, `g` for weight).
   - `stockQuantity` and `basePrice` in the database are ALWAYS stored in relation to this `baseUnit`.
2. **Conversion Strategy (`src/lib/units.ts`)**:
   - The user selects a `requestedUnit` in the frontend (e.g., they want 1 L of Acetone).
   - The system checks the conversion rate (1 L = 1000 mL).
   - The `convertQuantity` utility maps the requested unit to the base unit mathematically (e.g., `1 * 1000 = 1000 mL baseQuantity`).
   - The price is calculated purely against the `baseQuantity`.
3. **Audit Trail**:
   - The `OrderItem` table stores both what the user requested (`orderedQuantity` = 1, `orderedUnit` = 'L') AND the exact system interpretation (`baseQuantity` = 1000). This provides admins with a perfect audit trail and ensures calculations are sensible.

## Database Schema & Data Types (Precision & Scale)
Because chemical inventory handles micro-quantities (mg) and large bulk amounts (kg), standard floating-point numbers are insufficient and prone to rounding errors.

- **Choice of Type**: We used PostgreSQL's `DECIMAL` (mapped via Prisma as `Decimal`).
- **Quantities**: `Decimal(19, 6)` is used for `stockQuantity`, `orderedQuantity`, and `baseQuantity`. This safely stores up to 6 decimal places (perfect for milligram scaling against kilograms) and massive bulk integers.
- **Pricing**: `Decimal(19, 4)` is used for `basePrice` and `totalAmount`. This stores 4 decimal places for currency, preventing micro-cent drift during multiplication of large quantities.

## Demo Credentials
- **Admin Role**: `admin@aasamedchem.com` / `admin123`
- **Seller Role**: `seller@aasamedchem.com` / `seller123`

## Running Locally
1. Clone the repository and run `npm install`.
2. Copy `.env.example` to `.env` and add your `DATABASE_URL` and `NEXTAUTH_SECRET`.
3. Run `npm run seed` to populate the initial database schema with demo accounts and dummy chemical products.
4. Run `npm run dev` to start the development server.

## Vercel Deployment Instructions
To deploy this repository to your Vercel account:
1. Push all your code to a GitHub repository.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
3. Import your GitHub repository.
4. **Environment Variables**: Add:
   - `DATABASE_URL` = (Your Neon PostgreSQL Connection String)
   - `NEXTAUTH_SECRET` = (A random string, e.g., `my_super_secret_key_123`)
5. Click **Deploy**. Vercel will automatically detect Next.js and build the project successfully.

*(Note: The build utilizes `tsconfig.json` exclusions to prevent serverless deployment failures on local seeding scripts)*
