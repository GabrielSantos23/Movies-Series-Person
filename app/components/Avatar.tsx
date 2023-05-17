'use client';

import Placeholder from '@/public/assets/placeholder';
import Image from 'next/image';
import Logo from './../../public/assets/placeholderProfile';

interface AvatarProps {
  imageUrl?: string;
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl }) => {
  return (
    <div className='relative'>
      <div className='relative inline-block rounded-md overflow-hidden h-9 w-9 md:h-32 md:w-32'>
        {imageUrl === 'null' ? (
          <Logo />
        ) : (
          <img
            alt='Avatar'
            src={`${imageUrl ? imageUrl : '/assets/placeholder.jpg'}`}
          />
        )}
      </div>
    </div>
  );
};

export default Avatar;