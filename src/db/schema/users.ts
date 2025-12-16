import { pgTable, text, timestamp, boolean, integer, uuid, jsonb, date, pgEnum, decimal } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['escort', 'admin']);
export const genderEnum = pgEnum('gender', ['female', 'male', 'transsexual']);
export const languageLevelEnum = pgEnum('language_level', ['minimal', 'conversational', 'fluent']);
export const ethnicityEnum = pgEnum('ethnicity', ['georgian', 'russian', 'black', 'turk', 'armenian', 'azerbaijan', 'kazakh', 'greek', 'ukraine', 'other']);
export const hairColorEnum = pgEnum('hair_color', ['black', 'blonde', 'brown', 'brunette', 'chestnut', 'auburn', 'dark_blonde', 'golden', 'red', 'grey', 'silver', 'other']);
export const bustSizeEnum = pgEnum('bust_size', ['very_small', 'small_a', 'medium_b', 'large_c', 'very_large_d', 'enormous_e_plus']);
export const buildEnum = pgEnum('build', ['skinny', 'slim', 'regular', 'sport', 'fat']);

// Users/Profiles table 
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),

  // Auth fields
  password: text('password').notNull(),
  email: text('email').notNull().unique(),
  slug: text('slug').notNull().unique(), // Unique slug for SEO-friendly URLs (e.g., "natalia-tbilisi-123")
  publicExpiry: timestamp('public_expiry'),
  role: userRoleEnum('role').notNull().default('escort'),

  // Subscription features (can have multiple at same time)

  goldExpiresAt: timestamp('gold_expires_at'),

  featuredExpiresAt: timestamp('featured_expires_at'),

  silverExpiresAt: timestamp('silver_expires_at'),
  topExpiresAt: timestamp('top_expires_at'),
  newExpiresAt: timestamp('new_expires_at'),
  verifiedPhotosExpiry: timestamp('verified_photos_expiry'),

  // Basic Info
  name: text('name'),
  phone: text('phone').notNull(),
  whatsappAvailable: boolean('whatsapp_available').default(false),
  viberAvailable: boolean('viber_available').default(false),

  // Social Media
  website: text('website'),
  instagram: text('instagram'),
  snapchat: text('snapchat'),
  twitter: text('twitter'),
  facebook: text('facebook'),

  // Location
  city: text('city').notNull(),
  district: text('district'),

  // Personal Info
  gender: genderEnum('gender').notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  ethnicity: ethnicityEnum('ethnicity').notNull(),
  hairColor: hairColorEnum('hair_color'),
  bustSize: bustSizeEnum('bust_size'),
  height: integer('height').notNull(),
  weight: text('weight').notNull(),
  build: buildEnum('build'),

  // Availability
  incallAvailable: boolean('incall_available').default(false),
  outcallAvailable: boolean('outcall_available').default(false),

  // Description
  aboutYou: text('about_you').notNull(),

  // Languages - 3 languages max with levels
  languages: jsonb('languages').$type<Array<{
    name: string;
    level: 'minimal' | 'conversational' | 'fluent';
  }>>().default([]),

  // Rates - currency + rates for incall/outcall
  currency: text('currency').notNull().default('GEL'),
  rates: jsonb('rates').$type<{
    incall?: {
      thirtyMin?: string;
      oneHour?: string;
      twoHours?: string;
      threeHours?: string;
      sixHours?: string;
      twelveHours?: string;
      twentyFourHours?: string;
    };
    outcall?: {
      thirtyMin?: string;
      oneHour?: string;
      twoHours?: string;
      threeHours?: string;
      sixHours?: string;
      twelveHours?: string;
      twentyFourHours?: string;
    };
  }>(),

  // Services - array of service names
  services: text('services').array().default([]),



  // Media - images and videos with metadata
  images: jsonb('images').$type<Array<{
    url: string;
    width?: number;
    height?: number;
    size: number;
    mimeType: string;
    isPrimary?: boolean;
  }>>().default([]),
  videos: jsonb('videos').$type<Array<{
    url: string;
    width?: number;
    height?: number;
    duration?: number;
    size: number;
    mimeType: string;
    thumbnailUrl?: string;
  }>>().default([]),

  // Cover image - selected image to display on cards
  coverImage: text('cover_image'),

  // Timestamps
  lastActive: timestamp('last_active').defaultNow(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
