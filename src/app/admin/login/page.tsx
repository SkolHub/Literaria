'use client';

import { login } from '@/api/admin/auth';
import SmallTitle from '@/components/typography/small-title';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { initFirebaseApp } from '../../../../firebase.config';

export default function () {
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  async function onSubmit() {
    const user = await signInWithEmailAndPassword(
      getAuth(initFirebaseApp()),
      email,
      password
    );

    await login(await user.user.getIdToken());

    router.push('/admin/article/create');
  }

  return (
    <main className='flex h-full w-full items-start justify-center px-8 pt-80'>
      <section className='flex w-full max-w-[32rem] flex-col gap-12 rounded-[2rem] border-[1px] border-black/20 p-4 mobile:border-0'>
        <SmallTitle>Sign In</SmallTitle>
        <div className='flex flex-col gap-4'>
          <input
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className='border-primary-900 bg-background-50 sm:text-sm w-full rounded-full border p-3 text-gray-900 outline-none'
            placeholder='email'
          />
          <input
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            className='border-primary-900 bg-background-50 sm:text-sm w-full rounded-full border p-3 text-gray-900 outline-none'
            placeholder='password'
            type='password'
          />
          <button
            onClick={onSubmit}
            className='border-primary-900 hover:bg-primary-700 w-full rounded-full border-[1px] px-5 py-2.5 text-center text-sm font-medium text-black hover:bg-black/10'
          >
            Sign in
          </button>
        </div>
      </section>
    </main>
  );
}
