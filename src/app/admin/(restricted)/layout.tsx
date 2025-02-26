import { isLogged } from '@/api/admin/auth';
import { ReactNode } from 'react';

export default async function ({ children }: { children: ReactNode }) {
  const logged = await isLogged();

  if (logged) {
    return children;
  }

  return <></>;
}
