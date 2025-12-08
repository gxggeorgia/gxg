import 'dotenv/config';
import { db } from '@/db';
import { users, reports } from '@/db/schema';

async function nukeDatabase() {
  try {
    console.log('🚀 Starting database cleanup...');

    // Delete all data from all tables
    await db.delete(reports);
    await db.delete(users);

    console.log('Database nuked successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error nuking database:', error);
    process.exit(1);
  }
}

nukeDatabase();
