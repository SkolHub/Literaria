'use server';

import { getAuth } from 'firebase-admin/auth';
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { UploadThingError } from 'uploadthing/server';
import { initAdmin } from '../../../firebase-admin.config';

export async function login(token: string) {
  await initAdmin();

  const expiresIn = 60 * 60 * 24 * 14 * 1000;

  const sessionCookie = await getAuth().createSessionCookie(token, {
    expiresIn
  });

  (await cookies()).set('session', sessionCookie, {
    maxAge: expiresIn,
    httpOnly: true,
    secure: true
  });
}

export async function logout() {
  (await cookies()).delete('session');
}

export async function isAdmin() {
  if (!(await isLogged())) {
    throw new Error('Unauthorized');
  }
}

export async function isAdminRequest(req: NextRequest) {
  const sessionCookie = req.cookies.get('session')?.value;

  if (!sessionCookie) {
    throw new UploadThingError({
      code: 'FORBIDDEN',
      message: 'Unauthorized'
    });
  }

  await initAdmin();

  try {
    await getAuth().verifySessionCookie(sessionCookie, true);
  } catch {
    throw new UploadThingError({
      code: 'FORBIDDEN',
      message: 'Unauthorized'
    });
  }
}

export async function isLogged() {
  const sessionCookie = (await cookies()).get('session')?.value;

  if (!sessionCookie) {
    return false;
  }

  await initAdmin();

  try {
    await getAuth().verifySessionCookie(sessionCookie, true);
    return true;
  } catch {
    return false;
  }
}
