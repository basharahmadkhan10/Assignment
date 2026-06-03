# AasaMedChem - Inventory & Order Management Platform

A highly robust, scalable, and visually striking inventory and order management system built with Next.js (App Router), Prisma, Neon Serverless PostgreSQL, and a custom "Neobrutalist" design language. Designed specifically for the AasaMedChem hackathon assignment.

## Project Overview & Features
The AasaMedChem platform allows users (Buyers/Sellers) to browse chemical inventory, perform complex scientific unit conversions on the fly, and place precise quotations. Administrators have complete authority to manage users, update inventory stock dynamically, and approve or reject incoming orders.

**Key Features:**
- **Dynamic Unit Conversion:** Order in L, mL, kg, g, or count. The system mathematically scales base prices and quantities in real-time.
- **Role-Based Access Control (RBAC):** Strict separation between `ADMIN` and `BUYER` roles, complete with account suspension toggles (`isActive`).
- **Dynamic Inventory Deduction:** Atomic transaction logic securely deducts chemical stock the moment an Admin confirms an order.
- **Neobrutalism UI/UX:** A striking Black & White design utilizing `Space Grotesk` typography, solid structural borders, and sharp box-shadows.

---

## Tech Stack & High-Level System Design
- **Frontend (Presentation):** Built with Next.js 14+ App Router, React, Tailwind CSS, and `shadcn/ui`. The UI serves purely as a presentation and translation layer, handling initial unit math before submitting strict "Base Units" to the backend.
- **Backend (Logic):** Utilizes Next.js Server Actions. This creates a highly secure, type-safe RPC (Remote Procedure Call) layer, bypassing the need for traditional REST API routes.
- **Database (Data):** Neon Serverless PostgreSQL. Connected via Prisma ORM using connection pooling (`?pgbouncer=true`) to completely prevent serverless cold-start bottlenecks. 

---

## Unit Storage & Conversion Strategy
Handling scientific inventory requires extreme consistency to prevent rounding and conversion errors.

### The "Base Unit" Architecture
The database acts as a strict, immutable single source of truth. It **never** stores secondary units like `kg` or `L`. 
1. Every product has a defined `dimension` (WEIGHT, VOLUME, COUNT) and a lowest `baseUnit` (`g`, `mL`, `count`).
2. **Translation:** When a user inputs an order for `5 kg`, a centralized utility (`src/lib/units.ts`) translates this to `5000 g`.
3. **Storage:** The backend strictly processes and stores `5000 g`. 
4. **Audit Trail:** The `OrderItem` table stores what the user requested (`orderedQuantity` = 5, `orderedUnit` = 'kg') AND the system's strict interpretation (`baseQuantity` = 5000). This provides Admins with a perfect audit trail.

---

## Database Schema & Data Types
Because chemical APIs are often ordered in micro-fractions (e.g., 0.0005 kg) and priced highly, standard floating-point numbers in JavaScript/PostgreSQL are prone to arithmetic drift.

- **Choice of Type**: PostgreSQL `DECIMAL` (mapped via Prisma as `Decimal`).
- **Quantities (`Decimal(19, 6)`)**: Safely stores up to 6 decimal places, ensuring extreme precision when mapping fractions of kilograms down to grams without data loss.
- **Prices (`Decimal(19, 4)`)**: Prices and totals (`basePrice`, `calculatedPrice`) are stored to 4 decimal places for exact currency representation, preventing penny-drift during massive bulk multiplications.

---

## Setup Instructions (Running Locally)
1. **Clone and Install**: 
   ```bash
   git clone <repo-url>
   cd Assignment
   npm install
   ```
2. **Environment Setup**: 
   Create a `.env` file in the root directory.
   ```env
   DATABASE_URL="postgresql://<user>:<password>@<neon-host>.neon.tech/neondb?sslmode=require&pgbouncer=true"
   NEXTAUTH_SECRET="any_secure_random_string_here"
   NEXTAUTH_URL="http://localhost:3000"
   ```
3. **Database Migration & Seeding**:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```

---

## Demo Credentials & Usage Flow
The `seed.ts` script injects a fully populated chemical catalog and two accounts:
- **Admin**: `admin@aasamedchem.com` / `password`
- **Buyer**: `buyer@aasamedchem.com` / `password`

**Admin Flow:**
1. Log in as Admin. You are routed to `/dashboard/inventory`.
2. Add new products or use the **Update** button to modify base prices and available stock.
3. Visit the **Users** tab to Activate/Deactivate buyer accounts.
4. Visit the **Orders** tab to review incoming quotations and click "Confirm" to instantly deduct the requested stock from your inventory.

**Buyer Flow:**
1. Log in as Buyer. You are routed to the **Quotation Builder**.
2. Select a chemical, choose your preferred scientific unit (e.g., L instead of mL), and input a quantity.
3. The system dynamically scales the price. Submit the order.
4. Check your Dashboard. When an Admin confirms the order, a notification appears in your Notification Bell!

---

## Vercel Deployment Instructions
To re-deploy this system:
1. Push the code to a GitHub repository.
2. In the Vercel Dashboard, select **Add New > Project** and import the repository.
3. In the **Environment Variables** section, add `DATABASE_URL` (your Neon connection string) and `NEXTAUTH_SECRET`.
4. Click **Deploy**. Vercel will automatically build the Next.js App Router and launch the platform.
