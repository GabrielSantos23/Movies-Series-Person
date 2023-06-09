'use client';

import { useUser } from '@/hooks/useUser';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiOutlineUser } from 'react-icons/ai';
import { BiTv } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import { MdOutlineMovieCreation } from 'react-icons/md';
import { RiHomeLine } from 'react-icons/ri';

interface SidebarMobileProps {
  handleSearchClick: () => void;
  isOpen: boolean;
}

const MobileSidebar: React.FC<SidebarMobileProps> = ({
  handleSearchClick,
  isOpen,
}) => {
  const pathname = usePathname();
  const { user } = useUser();
  const links = [
    { icon: <RiHomeLine />, href: '/' || '' },
    { icon: <MdOutlineMovieCreation />, href: '/movies' },
    { icon: <BiTv />, href: '/tv' },
    { icon: <AiOutlineUser />, href: user?.id ? '/user' : '/profile' },
  ];

  return (
    <div className='fixed z-[999] right-0 lg:hidden flex bg-black w-full bottom-0 h-[80px]  '>
      <div className='p-5 flex w-full justify-between'>
        {links.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              className={`text-2xl
            ${isActive ? 'text-sky-500' : 'text-gray-200'}
            `}
              href={item.href}
              key={item.href}
            >
              {item.icon}
            </Link>
          );
        })}
        <div>
          <button>
            <BsSearch
              className={`text-2xl hover:text-sky-500 transition  ${
                isOpen ? 'text-sky-500' : 'text-gray-200'
              }`}
              onClick={handleSearchClick}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
