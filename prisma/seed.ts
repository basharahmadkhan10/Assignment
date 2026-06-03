import fs from 'fs';
import path from 'path';

async function main() {
  const envPath = path.resolve(process.cwd(), '.env');
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const dbUrlMatch = envContent.match(/DATABASE_URL="?([^"\n]+)"?/);
  const dbUrl = dbUrlMatch ? dbUrlMatch[1].trim() : process.env.DATABASE_URL;
  
  if (!dbUrl) throw new Error("Could not find DATABASE_URL in .env");

  const { PrismaClient, Role, Dimension, HazardClass } = await import('@prisma/client');
  const bcrypt = (await import('bcryptjs')).default;

  const { Pool, neonConfig } = await import('@neondatabase/serverless');
  const { PrismaNeon } = await import('@prisma/adapter-neon');
  const ws = (await import('ws')).default;

  const parsedUrl = new URL(dbUrl.trim());
  parsedUrl.searchParams.delete('channel_binding');
  const cleanUrl = parsedUrl.toString().replace('postgresql://', 'postgres://');
  console.log("Cleaned DB URL:", cleanUrl);

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: cleanUrl });
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  const adminPassword = await bcrypt.hash('admin123', 10)
  const sellerPassword = await bcrypt.hash('seller123', 10)

  await prisma.user.upsert({
    where: { email: 'admin@aasamedchem.com' },
    update: {},
    create: {
      email: 'admin@aasamedchem.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  })

  await prisma.user.upsert({
    where: { email: 'seller@aasamedchem.com' },
    update: {},
    create: {
      email: 'seller@aasamedchem.com',
      name: 'Seller User',
      passwordHash: sellerPassword,
      role: Role.SELLER,
    },
  })

  await prisma.product.deleteMany({})

  await prisma.product.create({
    data: {
      name: 'Acetone, ACS Reagent',
      description: 'Used as a polar, aprotic solvent in organic synthesis.',
      dimension: Dimension.VOLUME,
      baseUnit: 'mL',
      basePrice: 0.15,
      stockQuantity: 100000,
      storageCondition: 'Ambient, keep tightly closed',
      hazardClass: HazardClass.FLAMMABLE
    }
  })

  await prisma.product.create({
    data: {
      name: 'Potassium Cyanide, 99%',
      description: 'Highly toxic compound used in organic synthesis and mining.',
      dimension: Dimension.WEIGHT,
      baseUnit: 'g',
      basePrice: 50.00,
      stockQuantity: 5000,
      storageCondition: 'Locked, dry, well-ventilated',
      hazardClass: HazardClass.TOXIC
    }
  })

  await prisma.product.create({
    data: {
      name: 'Sulfuric Acid, 98%',
      description: 'Strong mineral acid used widely in chemical industry.',
      dimension: Dimension.VOLUME,
      baseUnit: 'mL',
      basePrice: 0.10,
      stockQuantity: 50000,
      storageCondition: 'Corrosives cabinet',
      hazardClass: HazardClass.CORROSIVE
    }
  })

  console.log('Seed data created!')
  await prisma.$disconnect()
}

main().catch(console.error)
