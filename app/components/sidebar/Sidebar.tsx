'use client';

import React, { useState, useRef, useEffect } from 'react';
import { RiHomeLine } from 'react-icons/ri';
import { MdOutlineMovieCreation } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';

import { BiTv } from 'react-icons/bi';
import { BsSearch } from 'react-icons/bs';
import { useSpring, animated } from 'react-spring';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import SearchBar from './SearchBar';
import MobileSidebar from './MobileSidebar';
import { useSession } from 'next-auth/react';
import { useUser } from '@/hooks/useUser';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  // const { data: session, status } = useSession();
  const { user } = useUser();

  const links = [
    { icon: <RiHomeLine />, href: '/' || '' },
    { icon: <MdOutlineMovieCreation />, href: '/movie' },
    { icon: <BiTv />, href: '/tv' },
    { icon: <AiOutlineUser />, href: user?.id ? '/user' : '/profile' },
  ];

  const router = useRouter();
  const pathname = usePathname();

  const handleSearchClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = () => {
    if (searchTerm.length > 0) {
      router.push(`/search?q=${searchTerm}`);
    } else {
      router.push('/');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [inputRef]);

  return (
    <>
      <SearchBar
        isOpen={isOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSubmit={handleSubmit}
        handleSearchClick={handleSearchClick}
      />
      <MobileSidebar handleSearchClick={handleSearchClick} isOpen={isOpen} />
      <div className='w-[100px] border-r border-[#141414] bg-black fixed h-full hidden  z-[999] lg:block'>
        <div className='flex w-full mt-10 justify-center '>
          <div className='flex gap-20  flex-col '>
            {links.map((link, index) => {
              const isActive = pathname === link.href;

              return (
                <Link href={link.href} key={index}>
                  <div
                    className={` text-2xl ${
                      isActive
                        ? 'text-sky-500'
                        : 'text-gray-200 transition hover:text-sky-500'
                    }`}
                    aria-label={`Link to ${link.href}`}
                  >
                    {link.icon}
                  </div>
                </Link>
              );
            })}
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
    </>
  );
};

export default Navbar;
