import type { Config } from 'drizzle-kit';
import { config } from 'dotenv';

config();

export default {
  driver: 'pg',
  schema: './drizzle/schema.ts',
  out: './drizzle',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!
  },
  verbose: true,
  strict: true
} satisfies Config;
