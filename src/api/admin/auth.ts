'use server';

import { cookies } from 'next/headers';

export async function login(token: string) {
  // await initAdmin();

  const expiresIn = 60 * 60 * 24 * 14 * 1000;

  // const sessionCookie = await getAuth().createSessionCookie(token, {
  //   expiresIn
  // });

  const sessionCookie = 'test';

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

export async function isLogged() {
  return (await cookies()).get('session')?.value !== undefined;

  // await initAdmin();

  // try {
  //   return await getAuth().verifySessionCookie(
  //     (await cookies()).get('session')?.value!,
  //     true
  //   );
  // } catch {
  //   return null;
  // }
}
