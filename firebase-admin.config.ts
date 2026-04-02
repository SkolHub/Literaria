import admin from 'firebase-admin';
import envConfig from './env.config';
import { atob } from 'node:buffer';

interface FirebaseAdminAppParams {
  projectId: string;
  clientEmail: string;
  privateKey: string;
}

function formatPrivateKey(key: string) {
  return key.replace(/\\n/g, '\n');
}

export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
  const privateKey = formatPrivateKey(params.privateKey);

  if (admin.apps.length > 0) {
    return admin.app();
  }

  const cert = admin.credential.cert({
    projectId: params.projectId,
    clientEmail: params.clientEmail,
    privateKey
  });

  return admin.initializeApp({
    credential: cert,
    projectId: params.projectId
  });
}

export async function initAdmin() {
  const service_account = JSON.parse(atob(envConfig.FIREBASE_SERVICE_ACCOUNT));

  const params: FirebaseAdminAppParams = {
    projectId: service_account.project_id,
    clientEmail: service_account.client_email,
    privateKey: service_account.private_key
  };

  return createFirebaseAdminApp(params);
}
