import * as schema from '@db/schema';
import { config } from 'dotenv';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import envConfig from '../../env.config';

config();

export const db: NodePgDatabase<typeof schema> = drizzle(
  envConfig.DATABASE_URL,
  {
    schema
  }
);
