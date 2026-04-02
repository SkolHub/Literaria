import { index, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const galleryImages = pgTable(
  'gallery_images',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    fileKey: text('file_key').notNull().unique(),
    url: text('url').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    createdAt: timestamp('created_at', { mode: 'string', precision: 3 })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { mode: 'string', precision: 3 })
      .notNull()
      .defaultNow()
  },
  (table) => [index().on(table.title)]
);
