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

// Profile interactions tracking (clicks on contact/social links)
export const profileInteractions = pgTable('profile_interactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  profileId: uuid('profile_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'phone', 'whatsapp', 'viber', 'instagram', etc.
  interactorIp: text('interactor_ip'),
  interactedAt: timestamp('interacted_at').defaultNow().notNull(),
});


// Relations
export const profileViewsRelations = relations(profileViews, ({ one }) => ({
  profile: one(users, {
    fields: [profileViews.profileId],
    references: [users.id],
  }),
}));

export const profileInteractionsRelations = relations(profileInteractions, ({ one }) => ({
  profile: one(users, {
    fields: [profileInteractions.profileId],
    references: [users.id],
  }),
}));

// Types
export type ProfileView = typeof profileViews.$inferSelect;
export type NewProfileView = typeof profileViews.$inferInsert;
export type ProfileInteraction = typeof profileInteractions.$inferSelect;
export type NewProfileInteraction = typeof profileInteractions.$inferInsert;
