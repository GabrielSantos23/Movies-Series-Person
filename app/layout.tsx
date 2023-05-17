'use client';

import Sidebar from './components/sidebar/Sidebar';
import AuthContext from './context/AuthContext';
import ToasterContext from './context/ToasterContext';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthContext>
          <div className='flex h-full'>
            <Sidebar />
            <ToasterContext />
            <div className='w-full lg:pl-[100px]'>
              <div>{children}</div>
            </div>
          </div>
        </AuthContext>
      </body>
    </html>
  );
}
