import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Create the connection
// Force use of Supabase connection pooler port 6543 which supports IPv4
const connectionString = process.env.DATABASE_URL!.replace(':5432', ':6543');

const pool = new Pool({ connectionString });
export const db = drizzle(pool, { schema });
