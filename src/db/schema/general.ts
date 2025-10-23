import { pgTable, text, timestamp, uuid, pgEnum, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Enums
export const reportStatusEnum = pgEnum('report_status', ['pending', 'reviewed', 'resolved', 'dismissed']);
export const reportReasonEnum = pgEnum('report_reason', ['fake_profile', 'inappropriate_content', 'scam', 'underage', 'spam', 'other']);

// Reports table
export const reports = pgTable('reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id').references(() => users.id, { onDelete: 'cascade' }), // Nullable - anonymous users can report
  reason: reportReasonEnum('reason').notNull(),
  description: text('description'),
  reporterName: text('reporter_name'),
  reporterEmail: text('reporter_email'),
  reporterIp: text('reporter_ip'),
  profileUrl: text('profile_url'), // Store the URL of the reported profile
  status: reportStatusEnum('status').notNull().default('pending'),
  adminNotes: text('admin_notes'),
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
export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
