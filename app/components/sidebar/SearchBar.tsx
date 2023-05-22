'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import { IoMdClose } from 'react-icons/io';
import Link from 'next/link';

interface Props {
  isOpen: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSubmit: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  handleSearchClick: () => void;
}

const SearchBar: React.FC<Props> = ({
  isOpen,
  searchTerm,
  setSearchTerm,
  handleSubmit,
  handleSearchClick,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const headerAnimation = useSpring({
    transform: isOpen ? 'translateY(0%)' : 'translateY(-100%)',
    config: { tension: 300, friction: 25 },
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        handleSearchClick();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, handleSearchClick]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <animated.div
      style={headerAnimation}
      className='h-[80px]  lg:ml-[100px] w-full  bg-[#202124] fixed  top-0 z-[99999] '
    >
      <div className='flex  flex-row  items-center h-full' ref={inputRef}>
        <input
          type='text'
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
          onKeyUp={handleSubmit}
          placeholder='Search for a movie, tv show or person...'
          className='w-[85%] h-[50px] text-base bg-transparent border-none ml-[45px] text-white focus:outline-none'
        />
        <button
          className='w-[50px] bg-transparent border-none'
          onClick={handleSearchClick}
        >
          <IoMdClose className='text-2xl text-white cursor-pointer hover:opacity-50 transition' />
        </button>
      </div>
    </animated.div>
  );
};

export default SearchBar;
