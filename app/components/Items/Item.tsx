'use client';

import Link from 'next/link';
import React from 'react';
import './ItemStyle.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Placeholder from '@/public/assets/placeholder';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { motion } from 'framer-motion';

interface ItemProps {
  item: {
    id?: number | string | undefined;
    poster_path?: string | undefined;
    title?: string | undefined;
    name?: string | undefined;
    vote_average?: number | null | undefined;
    character?: string;
    profile_path?: string | undefined;
  };
  type?: string | null;
  person?: boolean;
  url?: string;
  user?: boolean;
}

const Item: React.FC<ItemProps> = ({ item, type, person, url, user }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className='flex flex-col'>
      <div className='bg-[#202124]'>
        <Link href={`/${url ? url : type}/${item.id}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          >
            <LazyLoadImage
              className={`Image min-h-[370px] ${
                user && 'max-h-[370px] max-w-[250px] min-w-[250px]'
              } `}
              src={
                person && item.profile_path
                  ? `https://image.tmdb.org/t/p/original${item.profile_path}`
                  : item.poster_path
                  ? `https://image.tmdb.org/t/p/original${item.poster_path}`
                  : '/assets/placeholder.png'
              }
              alt={item.title || item.name}
              threshold={0}
              effect='opacity'
              afterLoad={handleImageLoad}
              placeholderSrc='/assets/placeholder.png'
            />
          </motion.div>
        </Link>
      </div>

      <p className='line-clamp-1 max-w-[250px]'>{item.title || item.name} </p>
      {!person && item?.vote_average !== 0 && (
        <div className='flex gap-3 items-center'>
          <Rating
            precision={0.5}
            readOnly
            size='small'
            sx={{
              fontSize: '15px',
              color: '#1d9bf0',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
            }}
            emptyIcon={
              <StarBorderIcon
                fontSize='inherit'
                style={{
                  color: '#1d9bf0',
                }}
              />
            }
            value={item?.vote_average ? item?.vote_average / 2 : 0}
          />
          <p className='text-stone-500 text-sm'>{item?.vote_average}</p>
        </div>
      )}
      {person && item?.vote_average !== 0 && (
        <>
          <p className='text-stone-500 text-sm'>{item.character}</p>
        </>
      )}
    </div>
  );
};

export default Item;
