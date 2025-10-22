import { db } from './index';
import { users } from './schema';

async function seed() {
  console.log('🌱 Seeding database...');

  // Note: Locations are stored as static data in src/data/locations.ts
  // Add any database seeding logic here if needed in the future
  
  console.log('✅ Database seeded successfully!');
  console.log('ℹ️  Note: Locations are managed as static data in src/data/locations.ts');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Error seeding database:', error);
  process.exit(1);
});
