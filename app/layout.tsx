'use client';

import IndexCookies from './components/Cookies/IndexCookies';
import InstallButton from './components/Cookies/InstallButton';
import CustomSwitch from './components/ProgressBar';
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
      <head>
        <link rel='manifest' href='/manifest.json' />
        <link rel='apple-touch-icon' href='/icon.png'></link>
        <meta name='theme-color' content='#fff' />
      </head>
      <body className={inter.className}>
        <AuthContext>
          <div className='flex h-full'>
            <Sidebar />

            <ToasterContext />
            <div className='w-full lg:pl-[100px]'>
              <div>
                <CustomSwitch>{children}</CustomSwitch>
              </div>

              <IndexCookies />
            </div>
          </div>
        </AuthContext>
      </body>
    </html>
  );
}
