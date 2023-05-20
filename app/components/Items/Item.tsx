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
  return (
    <div className='flex flex-col '>
      <div className='bg-[#202124]'>
        <Link href={`/${url ? url : type}/${item.id}`}>
          {item.poster_path || item.profile_path ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <LazyLoadImage
                className={`Image min-h-[370px] ${user && 'max-h-[370px]'} `}
                src={
                  person
                    ? `https://image.tmdb.org/t/p/original${item.profile_path}`
                    : item.poster_path
                    ? `https://image.tmdb.org/t/p/original${item.poster_path}`
                    : '/assets/placeholder.jsx'
                }
                alt={item.title || item.name}
                threshold={0}
                effect='opacity'
              />
            </motion.div>
          ) : (
            <Placeholder />
          )}
        </Link>
      </div>

      <p className='line-clamp-1'>{item.title || item.name} </p>
      {!person && (
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
      {person && (
        <>
          <p className='text-stone-500 text-sm'>{item.character}</p>
        </>
      )}
    </div>
  );
};

export default Item;
