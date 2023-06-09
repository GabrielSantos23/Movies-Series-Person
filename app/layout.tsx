import SupabaseProvider from '@/providers/SupabaseProvider';
import IndexCookies from './components/Cookies/IndexCookies';
import CustomSwitch from './components/ProgressBar';
import Sidebar from './components/sidebar/Sidebar';
import AuthContext from './context/AuthContext';
import ToasterContext from './context/ToasterContext';
import './globals.css';
import { Inter } from 'next/font/google';
import UserProvider from '@/providers/UserProvider';
import ModalProvider from '@/providers/ModalProvider';
import ToasterProvider from '@/providers/ToasterProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Browse Movies, TV Shows and People',
  description: 'A plataform free for you to watch TV shows and Movies',
};

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
        <ToasterProvider />
        <SupabaseProvider>
          <UserProvider>
            <ModalProvider />
            <div className='flex h-full'>
              <Sidebar />
              <div className='w-full lg:pl-[100px]'>
                <div>
                  <CustomSwitch>{children}</CustomSwitch>
                </div>
                <IndexCookies />
              </div>
            </div>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
