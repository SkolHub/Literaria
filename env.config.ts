import { config } from 'dotenv';

config();

export default process.env as unknown as {
  DATABASE_URL: string;

  FIREBASE_SERVICE_ACCOUNT: string;
};
