import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

// Profile views tracking (simple counter)
export const profileViews = pgTable('profile_views', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  viewerIp: text('viewer_ip'),
  viewedAt: timestamp('viewed_at').defaultNow().notNull(),
});

// Phone clicks tracking (simple counter)
export const phoneClicks = pgTable('phone_clicks', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  clickerIp: text('clicker_ip'),
  clickedAt: timestamp('clicked_at').defaultNow().notNull(),
});

// Search queries tracking
export const searchQueries = pgTable('search_queries', {
  id: uuid('id').defaultRandom().primaryKey(),
  query: text('query'),
  filters: text('filters'), // JSON string of applied filters
  resultsCount: integer('results_count'),
  userIp: text('user_ip'),
  searchedAt: timestamp('searched_at').defaultNow().notNull(),
});

// Relations
export const profileViewsRelations = relations(profileViews, ({ one }) => ({
  profile: one(users, {
    fields: [profileViews.profileId],
    references: [users.id],
  }),
}));

export const phoneClicksRelations = relations(phoneClicks, ({ one }) => ({
  profile: one(users, {
    fields: [phoneClicks.profileId],
    references: [users.id],
  }),
}));

// Types
export type ProfileView = typeof profileViews.$inferSelect;
export type NewProfileView = typeof profileViews.$inferInsert;
export type PhoneClick = typeof phoneClicks.$inferSelect;
export type NewPhoneClick = typeof phoneClicks.$inferInsert;
export type SearchQuery = typeof searchQueries.$inferSelect;
export type NewSearchQuery = typeof searchQueries.$inferInsert;
