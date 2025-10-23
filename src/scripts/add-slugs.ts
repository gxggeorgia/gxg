// add-slugs.ts
// npx tsx src/scripts/add-slugs.ts

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { users } from '@/db/schema/users';
import { eq } from 'drizzle-orm';
import { generateSlug } from '@/lib/slug';

// Hardcoded credentials
const DATABASE_URL = 'postgresql://postgres:development@db.jbhvtgnqbeowuwprymbk.supabase.co:5432/postgres';

// Initialize database
const client = postgres(DATABASE_URL);
const db = drizzle(client);

async function addSlugs() {
  console.log('🔄 Starting to add slugs to all profiles...\n');
  
  try {
    // Get all users
    const allUsers = await db.select().from(users);
    
    console.log(`Found ${allUsers.length} profiles to update.\n`);
    
    let successCount = 0;
    let errorCount = 0;
    const usedSlugs = new Set<string>();
    
    for (const user of allUsers) {
      try {
        if (!user.name || !user.city) {
          console.log(`⚠️  Skipping ${user.email}: missing name or city`);
          continue;
        }
        
        // Generate unique slug
        let slug = generateSlug(user.name, user.city);
        
        // Ensure uniqueness
        while (usedSlugs.has(slug)) {
          slug = generateSlug(user.name, user.city);
        }
        usedSlugs.add(slug);
        
        await db.update(users)
          .set({ slug })
          .where(eq(users.id, user.id));
        
        console.log(`✅ Updated ${user.name || user.email}: ${slug}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error updating ${user.name || user.email}:`, error);
        errorCount++;
      }
    }
    
    console.log(`\n✅ Update completed!`);
    console.log(`   - Successfully updated: ${successCount} profiles`);
    console.log(`   - Errors: ${errorCount} profiles`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

addSlugs();
