import * as schema from '@db/schema';
import { config } from 'dotenv';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import envConfig from '../../env.config';

config();

const pool = new Pool({
  connectionString: envConfig.DATABASE_URL
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, {
  schema
});
