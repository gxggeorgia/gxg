// npx tsx src/scripts/create-admin.ts
import 'dotenv/config';
import { db } from '../db';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';
import { hashPassword } from '../lib/auth';
import { generateSlug } from '../lib/slug';

async function createAdmin() {
  try {
    const email = 'admin@gmail.com';
    const password = 'admin123'; // Change this to a secure password

    console.log('🔍 Checking if admin user already exists...');

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log('⚠️  User already exists. Updating to admin role...');

      // Update existing user to admin
      const [updatedUser] = await db
        .update(users)
        .set({
          role: 'admin',
          publicExpiry: new Date('2099-01-01'),
          emailVerified: true,
        })
        .where(eq(users.email, email))
        .returning();

      console.log('User updated to admin successfully!');
      console.log('Email:', email);
      console.log('User ID:', updatedUser.id);
      console.log('Role:', updatedUser.role);
      console.log('Role:', updatedUser.role);
    } else {
      console.log('📝 Creating new admin user...');

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Generate slug for admin user
      const slug = generateSlug('Admin', 'Tbilisi');

      // Create admin user
      interface User {
        id: string;
        email: string;
        name: string | null;
        role: string;
        password: string;
        slug: string;
        phone: string;
        publicExpiry: Date | null;
        emailVerified: boolean;
        city: string;
        gender: string;
        dateOfBirth: string;
        ethnicity: string;
        height: number;
        weight: string;
        aboutYou: string;
      }

      const [admin] = await db.insert(users).values({
        email,
        password: hashedPassword,
        name: 'Admin',
        slug,
        phone: '+990000000000',
        role: 'admin',
        publicExpiry: new Date('2099-01-01'),
        emailVerified: true,
        city: 'Tbilisi',
        gender: 'male',
        dateOfBirth: '1990-01-01',
        ethnicity: 'georgian',
        height: 180,
        weight: '75',
        aboutYou: 'System Administrator',
      }).returning();

      console.log('✅ Admin user created successfully!');
      console.log('Email:', email);
      console.log('Password:', password);
      console.log('User ID:', admin.id);
      console.log('Role:', admin.role);
      console.log('Role:', admin.role);
    }

    console.log('\n⚠️  Default password: admin123');
    console.log('⚠️  Please change the password after first login!');
    console.log('\n🔗 Login at: http://localhost:3000');
    console.log('🔗 Admin panel: http://localhost:3000/admin');

    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

createAdmin();

