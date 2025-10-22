import { pgTable, text, timestamp, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Enums
export const reportStatusEnum = pgEnum('report_status', ['pending', 'reviewed', 'resolved', 'dismissed']);
export const reportReasonEnum = pgEnum('report_reason', ['fake_profile', 'inappropriate_content', 'scam', 'underage', 'spam', 'other']);
export const contactStatusEnum = pgEnum('contact_status', ['new', 'in_progress', 'resolved', 'closed']);
export const contactTypeEnum = pgEnum('contact_type', ['support', 'inquiry', 'complaint', 'feedback', 'other']);

// Reports table
export const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  reason: reportReasonEnum('reason').notNull(),
  description: text('description'),
  reporterName: text('reporter_name'),
  reporterEmail: text('reporter_email'),
  reporterIp: text('reporter_ip'),
  status: reportStatusEnum('status').notNull().default('pending'),
  adminNotes: text('admin_notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Contact/Support messages table
export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject').notNull(),
  message: text('message').notNull(),
  type: contactTypeEnum('type').notNull().default('support'),
  status: contactStatusEnum('status').notNull().default('new'),
  userIp: text('user_ip'),
  adminResponse: text('admin_response'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Verification tokens (for email verification, password reset)
export const verificationTokens = pgTable('verification_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  type: text('type').notNull(), // 'email_verification' or 'password_reset'
  expires: timestamp('expires').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const reportsRelations = relations(reports, ({ one }) => ({
  profile: one(users, {
    fields: [reports.profileId],
    references: [users.id],
  }),
}));

export const verificationTokensRelations = relations(verificationTokens, ({ one }) => ({
  user: one(users, {
    fields: [verificationTokens.userId],
    references: [users.id],
  }),
}));

// Types
export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
export type Contact = typeof contacts.$inferSelect;
export type NewContact = typeof contacts.$inferInsert;
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
