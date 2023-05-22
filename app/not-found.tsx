'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import HelmetComponent from './components/Helmet';
import Link from 'next/link';

function NotFound() {
  const router = useRouter();

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <HelmetComponent title={'404 Page not Found'} />
      <p className='text-2xl text-center font-normal'>
        This page could not be found
      </p>
      <p className='text-xl  mb-4 mt-4 text-stone-500 max-w-[450px] text-center'>
        Looks like you ve followed a broken link or entered a URL that doesnt
        exist on this site.
      </p>
      <p className='text-gray-200 text-base flex gap-1 items-center'>
        Back to our
        <a
          className=' text-stone-500 text-center underline pointer'
          href='/'
          onClick={() => router.push('/')}
        >
          home page.
        </a>
      </p>
    </div>
  );
}

export default NotFound;
