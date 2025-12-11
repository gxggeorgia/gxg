// seed.ts
// npx tsx src/scripts/seed.ts 

import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from '@/db/schema/users';
import { hashPassword } from '@/lib/auth';
import { generateSlug } from '@/lib/slug';

// Use environment variable
const DATABASE_URL = process.env.DATABASE_URL!;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in environment variables');
}


const R2_ACCOUNT_ID = 'a725b00d5ad140eee93f0d2d7499068a';
const R2_ACCESS_KEY_ID = 'b4bfcde1ecd679f4f52161b3a89c8e83';
const R2_SECRET_ACCESS_KEY = '9cddfd9cd9873b9a944101cfc5da1bb531bab2988f83163b332217510dc8f229';
const R2_BUCKET_NAME = 'eg-dev';

// Initialize database
async function getDbConnection() {
  // Force use of Supabase connection pooler port 6543 which supports IPv4
  const connectionString = DATABASE_URL.replace(':5432', ':6543');
  console.log('Connecting to database using pooler port 6543...');

  const pool = new Pool({ connectionString });
  return drizzle(pool);
}

const imageDir = '/home/ravi/Desktop/EG/temp/uploads';
const images = fs.readdirSync(imageDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f) && fs.statSync(path.join(imageDir, f)).isFile());

// R2 Client with hardcoded credentials
const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function uploadImageToR2(filePath: string, fileName: string, userId: string): Promise<string> {
  try {
    const fileContent = fs.readFileSync(filePath);
    const key = `${userId}/images/${Date.now()}-${fileName}`;

    await r2Client.send(new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: 'image/jpeg'
    }));

    return `/api/media/${key}`;
  } catch (error) {
    console.error(`Failed to upload ${fileName}:`, error);
    throw error;
  }
}

const names = ['Natalia', 'Ketevan', 'Irina', 'Mariam', 'Tamara', 'Nino', 'Elene', 'Salome', 'Lela', 'Zurab', 'Eka', 'Nata', 'Tamar', 'Giorgi', 'Sopo', 'Maia', 'Natia', 'Beqa', 'Zara', 'Lizi'];
const cities = ['Tbilisi', 'Batumi', 'Kutaisi', 'Gori', 'Zugdidi', 'Ganja'];
const districts = ['Vake', 'Saburtalo', 'Central', 'Downtown', 'Beach'];
const ethnicities = ['georgian', 'russian', 'azerbaijan', 'turk', 'armenian'];
const hairColors = ['black', 'blonde', 'brown', 'brunette', 'auburn', 'dark_blonde', 'red'];
const bustSizes = ['small_a', 'medium_b', 'large_c', 'very_large_d'];
const builds = ['skinny', 'slim', 'regular', 'sport'];
// Valid service keys from en.json services translations
const services = [
  'oralWithoutCondom',
  'cim',
  'cob',
  'dfk',
  'classicSex',
  'striptease',
  'goldenShower',
  'gfe',
  'footFetish',
  'cunnilingus',
  'analRimming',
  'oralWithCondom',
  'cof',
  'deepThroat',
  'analSex',
  'sixtynine',
  'eroticMassage',
  'couples',
  'threesome',
  'sexToys',
  'domination'
];
const languages = [
  { name: 'Georgian', level: 'fluent' as const },
  { name: 'English', level: 'conversational' as const },
  { name: 'Russian', level: 'fluent' as const },
  { name: 'French', level: 'conversational' as const }
];

async function seed() {
  const db = await getDbConnection();
  console.log('🌱 Starting seed with 20 profiles and R2 uploads...');

  for (let i = 0; i < 20; i++) {
    const name = names[i];
    const email = `${name.toLowerCase()}${i}@example.com`;
    const password = await hashPassword('password123');

    const userId = `user-${i}`;
    console.log(`\n📤 Uploading images for ${name}...`);
    const profileImages = await Promise.all(
      images.slice(i * 10, (i + 1) * 10).map(async (img, idx) => {
        const imagePath = path.join(imageDir, img);
        const stats = fs.statSync(imagePath);
        const r2Url = await uploadImageToR2(imagePath, img, userId);
        return {
          url: r2Url,
          mimeType: 'image/jpeg',
          size: stats.size,
          isPrimary: idx === 0
        };
      })
    );

    const userLangs = languages.slice(0, Math.floor(Math.random() * 3) + 1);
    // Get 5-12 random services
    const shuffledServices = [...services].sort(() => Math.random() - 0.5);
    const userServices = shuffledServices.slice(0, Math.floor(Math.random() * 8) + 5);

    const city = cities[Math.floor(Math.random() * cities.length)];
    // Generate slug (8 random chars makes collisions extremely unlikely)
    const slug = generateSlug(name, city);

    try {
      await db.insert(users).values({
        email,
        password,
        name,
        slug,
        phone: `+995${590000000 + i}`,
        city,
        district: districts[Math.floor(Math.random() * districts.length)],
        gender: (i < 18 ? 'female' : 'male') as 'female' | 'male',
        dateOfBirth: `${1995 + Math.floor(Math.random() * 6)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}` as any,
        ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)] as 'georgian' | 'russian' | 'azerbaijan' | 'turk' | 'armenian',
        height: 160 + Math.floor(Math.random() * 25),
        weight: String(50 + Math.floor(Math.random() * 30)),
        hairColor: hairColors[Math.floor(Math.random() * hairColors.length)] as any,
        bustSize: i < 18 ? (bustSizes[Math.floor(Math.random() * bustSizes.length)] as any) : undefined,
        build: builds[Math.floor(Math.random() * builds.length)] as any,
        aboutYou: `Professional escort offering premium companionship services. Fluent in multiple languages, discreet and professional.`,
        whatsappAvailable: Math.random() > 0.3,
        viberAvailable: Math.random() > 0.4,
        instagram: `@${name.toLowerCase()}_escort`,
        incallAvailable: Math.random() > 0.2,
        outcallAvailable: Math.random() > 0.1,
        languages: userLangs,
        services: userServices as any,
        currency: 'GEL',
        rates: {
          incall: { oneHour: String(100 + i * 5), twoHours: String(180 + i * 10), threeHours: String(260 + i * 15) },
          outcall: { oneHour: String(140 + i * 5), twoHours: String(260 + i * 10), threeHours: String(380 + i * 15) }
        },
        images: profileImages,
        videos: [],
        coverImage: profileImages[0]?.url,
        role: 'escort' as 'escort' | 'admin',

        // New Schema Fields
        publicExpiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now (Public)
        featuredExpiresAt: Math.random() > 0.7 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
        goldExpiresAt: Math.random() > 0.8 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
        silverExpiresAt: Math.random() > 0.85 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
        verifiedPhotosExpiry: Math.random() > 0.5 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
      });
      console.log(`✅ Created profile: ${name} with ${profileImages.length} images uploaded to R2`);
    } catch (error) {
      console.error(`❌ Error creating ${name}:`, error);
    }
  }

  console.log('\n✅ Seed completed! 20 profiles created with R2 images.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});