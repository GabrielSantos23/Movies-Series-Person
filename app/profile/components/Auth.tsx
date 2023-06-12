'use client';

import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Auth } from '@supabase/auth-ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthComponent = () => {
  const router = useRouter();
  // const { data: session, status } = useSession();
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();

  useEffect(() => {
    if (session) {
      router.refresh();
      router.push('/user');
    }
  }, [session, router]);

  return (
    <div className='lg:ml-[100px] lg:mb-0 mb-[80px] z-[999999] bg-neutral-900/90 backdrop-blur-sm fixed inset-0'>
      <div className='fixed drop-shadow-md border-neutral-700 top-[50%] left-2/4 max-h-full h-full md:h-auto md:max-h-[85vh] w-full md:w-[90vw] md:max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-neutral-800 p-[25px] focus:outline-none'>
        <div className='text-xl text-center font-bold mb-4'>Welcome back</div>
        <div className='mb-5 text-sm leading-normal text-center'>
          Login to your account
        </div>
        <Auth
          supabaseClient={supabaseClient}
          magicLink
          providers={['google', 'github']}
          theme='dark'
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#404040',
                  brandAccent: '#0ea5e9',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AuthComponent;
