import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with realistic initial data...');

  const passwordHash = await bcrypt.hash('Password@123', 10);

  // 1. Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@storerating.com' },
    update: {
      name: 'System Administrator Master',
      passwordHash,
      role: Role.ADMIN,
      address: '100 Tech Enterprise Blvd, Silicon Valley, CA 94025',
    },
    create: {
      name: 'System Administrator Master',
      email: 'admin@storerating.com',
      passwordHash,
      address: '100 Tech Enterprise Blvd, Silicon Valley, CA 94025',
      role: Role.ADMIN,
    },
  });

  // 2. Store Owners
  const owner1 = await prisma.user.upsert({
    where: { email: 'owner.organic@storerating.com' },
    update: {
      name: 'Store Owner Michael Scott',
      passwordHash,
      role: Role.STORE_OWNER,
      address: '42 Scranton Industrial Park, PA 18503',
    },
    create: {
      name: 'Store Owner Michael Scott',
      email: 'owner.organic@storerating.com',
      passwordHash,
      address: '42 Scranton Industrial Park, PA 18503',
      role: Role.STORE_OWNER,
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: 'owner.coffee@storerating.com' },
    update: {
      name: 'Store Owner Jennifer Lopez',
      passwordHash,
      role: Role.STORE_OWNER,
      address: '777 Sunset Strip Suite 400, Los Angeles, CA 90069',
    },
    create: {
      name: 'Store Owner Jennifer Lopez',
      email: 'owner.coffee@storerating.com',
      passwordHash,
      address: '777 Sunset Strip Suite 400, Los Angeles, CA 90069',
      role: Role.STORE_OWNER,
    },
  });

  const owner3 = await prisma.user.upsert({
    where: { email: 'owner.tech@storerating.com' },
    update: {
      name: 'Store Owner Jonathan Vance',
      passwordHash,
      role: Role.STORE_OWNER,
      address: '55 Market Street Floor 12, San Francisco, CA 94105',
    },
    create: {
      name: 'Store Owner Jonathan Vance',
      email: 'owner.tech@storerating.com',
      passwordHash,
      address: '55 Market Street Floor 12, San Francisco, CA 94105',
      role: Role.STORE_OWNER,
    },
  });

  // 3. Normal Users
  const user1 = await prisma.user.upsert({
    where: { email: 'user.alexander@storerating.com' },
    update: {
      name: 'Alexander Hamilton Smith',
      passwordHash,
      role: Role.USER,
      address: '57 Wall Street, Financial District, New York, NY 10005',
    },
    create: {
      name: 'Alexander Hamilton Smith',
      email: 'user.alexander@storerating.com',
      passwordHash,
      address: '57 Wall Street, Financial District, New York, NY 10005',
      role: Role.USER,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user.benjamin@storerating.com' },
    update: {
      name: 'Benjamin Franklin Cooper',
      passwordHash,
      role: Role.USER,
      address: '316 Market Street, Center City, Philadelphia, PA 19106',
    },
    create: {
      name: 'Benjamin Franklin Cooper',
      email: 'user.benjamin@storerating.com',
      passwordHash,
      address: '316 Market Street, Center City, Philadelphia, PA 19106',
      role: Role.USER,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'user.christopher@storerating.com' },
    update: {
      name: 'Christopher Nolan Davis',
      passwordHash,
      role: Role.USER,
      address: '842 Hollywood Hills Road, Los Angeles, CA 90068',
    },
    create: {
      name: 'Christopher Nolan Davis',
      email: 'user.christopher@storerating.com',
      passwordHash,
      address: '842 Hollywood Hills Road, Los Angeles, CA 90068',
      role: Role.USER,
    },
  });

  const user4 = await prisma.user.upsert({
    where: { email: 'user.daniel@storerating.com' },
    update: {
      name: 'Daniel Jackson Rodriguez',
      passwordHash,
      role: Role.USER,
      address: '1042 Ocean Drive, South Beach, Miami, FL 33139',
    },
    create: {
      name: 'Daniel Jackson Rodriguez',
      email: 'user.daniel@storerating.com',
      passwordHash,
      address: '1042 Ocean Drive, South Beach, Miami, FL 33139',
      role: Role.USER,
    },
  });

  // 4. Stores
  const store1 = await prisma.store.upsert({
    where: { email: 'contact@freshharvestmarket.com' },
    update: {
      name: 'Fresh Harvest Organic Market',
      address: '124 Greenway Avenue, Portland, OR 97201',
      ownerId: owner1.id,
    },
    create: {
      name: 'Fresh Harvest Organic Market',
      email: 'contact@freshharvestmarket.com',
      address: '124 Greenway Avenue, Portland, OR 97201',
      ownerId: owner1.id,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { email: 'info@artisanroastcoffee.com' },
    update: {
      name: 'Artisan Roast Specialty Coffee',
      address: '488 Lexington Ave, New York, NY 10017',
      ownerId: owner2.id,
    },
    create: {
      name: 'Artisan Roast Specialty Coffee',
      email: 'info@artisanroastcoffee.com',
      address: '488 Lexington Ave, New York, NY 10017',
      ownerId: owner2.id,
    },
  });

  const store3 = await prisma.store.upsert({
    where: { email: 'support@nextgenelectronics.com' },
    update: {
      name: 'NextGen Electronics Hub',
      address: '720 Silicon Park Drive, Austin, TX 78701',
      ownerId: owner3.id,
    },
    create: {
      name: 'NextGen Electronics Hub',
      email: 'support@nextgenelectronics.com',
      address: '720 Silicon Park Drive, Austin, TX 78701',
      ownerId: owner3.id,
    },
  });

  const store4 = await prisma.store.upsert({
    where: { email: 'books@grandcentralcafe.com' },
    update: {
      name: 'Grand Central Books & Cafe',
      address: '89 Grand Blvd, Chicago, IL 60611',
      ownerId: owner2.id,
    },
    create: {
      name: 'Grand Central Books & Cafe',
      email: 'books@grandcentralcafe.com',
      address: '89 Grand Blvd, Chicago, IL 60611',
      ownerId: owner2.id,
    },
  });

  const store5 = await prisma.store.upsert({
    where: { email: 'sales@urbanfitnessdepot.com' },
    update: {
      name: 'Urban Fitness Equipment Depot',
      address: '310 Broad St, Seattle, WA 98109',
      ownerId: owner1.id,
    },
    create: {
      name: 'Urban Fitness Equipment Depot',
      email: 'sales@urbanfitnessdepot.com',
      address: '310 Broad St, Seattle, WA 98109',
      ownerId: owner1.id,
    },
  });

  // 5. Ratings
  const ratingsData = [
    { userId: user1.id, storeId: store1.id, value: 5 },
    { userId: user2.id, storeId: store1.id, value: 4 },
    { userId: user3.id, storeId: store1.id, value: 5 },
    { userId: user1.id, storeId: store2.id, value: 5 },
    { userId: user2.id, storeId: store2.id, value: 4 },
    { userId: user4.id, storeId: store2.id, value: 4 },
    { userId: user2.id, storeId: store3.id, value: 4 },
    { userId: user3.id, storeId: store3.id, value: 5 },
    { userId: user1.id, storeId: store4.id, value: 4 },
    { userId: user4.id, storeId: store4.id, value: 5 },
    { userId: user3.id, storeId: store5.id, value: 3 },
  ];

  for (const r of ratingsData) {
    await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId: r.userId,
          storeId: r.storeId,
        },
      },
      update: {
        value: r.value,
      },
      create: {
        userId: r.userId,
        storeId: r.storeId,
        value: r.value,
      },
    });
  }

  console.log('Seeding completed successfully!');
  console.log({
    admin: admin.email,
    owners: [owner1.email, owner2.email, owner3.email],
    users: [user1.email, user2.email, user3.email, user4.email],
    storesCount: 5,
    ratingsCount: ratingsData.length,
  });
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
