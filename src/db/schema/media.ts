import { pgTable, uuid, text, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: text('file_size').notNull(),
  mimeType: text('mime_type').notNull(),
  isImage: boolean('is_image').notNull().default(true),
  isVideo: boolean('is_video').notNull().default(false),
  isPrimary: boolean('is_primary').notNull().default(false),
  width: text('width'),
  height: text('height'),
  duration: text('duration'),
  thumbnailUrl: text('thumbnail_url'),
  status: text('status', { enum: ['pending', 'processing', 'active', 'deleted'] }).notNull().default('pending'),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const mediaRelations = relations(media, ({ one }) => ({
  user: one(users, {
    fields: [media.userId],
    references: [users.id],
  }),
}));

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
