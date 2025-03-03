import { defineConfig } from 'drizzle-kit';
import envConfig from './env.config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/**/*',
  out: './src/db/migrations',
  dbCredentials: {
    url: envConfig.DATABASE_URL
  }
});
