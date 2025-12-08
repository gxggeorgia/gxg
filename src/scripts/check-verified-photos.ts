
import 'dotenv/config';
import { db } from '@/db';
import { users } from '@/db/schema/users';
import { eq, count } from 'drizzle-orm';

async function checkVerifiedPhotos() {
    try {
        const result = await db
            .select({ count: count() })
            .from(users)
            .where(eq(users.verifiedPhotos, true));

        console.log(`Users with verifiedPhotos = true: ${result[0].count}`);

        const total = await db
            .select({ count: count() })
            .from(users);

        console.log(`Total users: ${total[0].count}`);

    } catch (error) {
        console.error('Error checking verified photos:', error);
    }
    process.exit(0);
}

checkVerifiedPhotos();
