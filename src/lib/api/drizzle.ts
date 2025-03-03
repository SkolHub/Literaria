import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../../drizzle/schema';
import {
  article,
  articleContent, articleRelations,
  recommendedArticle,
  user
} from '../../../drizzle/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema: {
    article,
    user,
    recommendedArticle,
    articleContent,
    articleRelations
  }
});
