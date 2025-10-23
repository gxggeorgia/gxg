const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function nukeDB() {
  const client = await pool.connect();
  try {
    console.log('🔥 NUKING DATABASE...');
    
    await client.query('DROP SCHEMA IF EXISTS public CASCADE;');
    await client.query('DROP SCHEMA IF EXISTS drizzle CASCADE;');
    await client.query('CREATE SCHEMA public;');
    
    console.log('✓ Database completely wiped');
    client.release();
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    client.release();
    await pool.end();
    process.exit(1);
  }
}

nukeDB();
