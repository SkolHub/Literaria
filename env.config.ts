import { config } from 'dotenv';

config();

export default process.env as unknown as {
  DATABASE_URL: string;

  FIREBASE_SERVICE_ACCOUNT: string;
  R2_S3_ENDPOINT: string;
  R2_BUCKET: string;
  R2_ACCESS_KEY_ID: string;
  R2_SECRET_ACCESS_KEY: string;
  R2_PUBLIC_BASE_URL: string;
  R2_REGION?: string;
};
