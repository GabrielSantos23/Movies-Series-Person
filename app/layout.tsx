'use client';

import { useEffect, useRef, useState } from 'react';
import SearchBar from './components/sidebar/SearchBar';
import Sidebar from './components/sidebar/Sidebar';
import './globals.css';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/navigation';
import MobileSidebar from './components/sidebar/MobileSidebar';
import Sidebars from './components/sidebar/Sidebars';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='flex h-full'>
          <Sidebar />

          <div className='w-full lg:pl-[100px]'>
            <div>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
