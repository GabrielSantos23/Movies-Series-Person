'use client';

import React from 'react';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { motion } from 'framer-motion';

import Link from 'next/link';
import Image from 'next/image';
import HelmetComponent from '../Helmet';

interface HeaderMobileProps {
  showImage: boolean;
  movie: any;
  numSeasons: number | null;
  numReviews: number | null;
  usRating: string | null;
  showContent: boolean;
  handleEpisodeClick?: () => void;
}

const HeaderMobile: React.FC<HeaderMobileProps> = ({
  showImage,
  movie,
  numSeasons,
  numReviews,
  usRating,
  showContent,
  handleEpisodeClick,
  //   showModal,
  //   imdbid,
  //   link,
  //   setShowModal,
}) => {
  //   const handleEpisodeClick = () => {
  //     setShowModal(true);
  //   };
  //   const handleCloseModal = () => {
  //     setShowModal(false);
  //   };

  const handleWatchNowClick = () => {
    const movieSection = document.getElementById('movie');
    if (movieSection) {
      movieSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <div
      className='h-[70vh] w-full bg-black lg:hidden'
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className='headerMobileBG relative h-full w-full'>
        <div className='absolute z-[1000] flex h-full w-full flex-col justify-end px-5'>
          <Link href={movie.name ? `/serie/${movie.id}` : `/movie/${movie.id}`}>
            <h1 className='text-2xl font-normal'>
              {movie.title || movie.name}
            </h1>
          </Link>
          <div className='mt-5 flex gap-2'>
            <Rating
              precision={0.5}
              readOnly
              size='small'
              sx={{
                fontSize: '20px',
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
              value={movie?.vote_average / 2}
            />
            <p className='text-neutral-500'>{numReviews} Reviews</p>
            {movie?.release_date && !movie?.media_type && (
              <p className='text-neutral-500'>
                {new Date(movie.release_date).getFullYear()}
              </p>
            )}

            {movie?.media_type === 'tv' && numSeasons && (
              <p className='text-neutral-500'>{numSeasons} seasons</p>
            )}
            {usRating && <p className='text-neutral-500'>{usRating} </p>}
          </div>
          <div className='mb-5 mt-5 line-clamp-2 w-full text-sm '>
            {movie?.overview}
          </div>
          <div className='absolute z-[99999999999999999] flex h-full w-[90vw] items-center justify-center pl-[-40px]'>
            <button onClick={handleWatchNowClick}>
              <Image
                width={50}
                height={50}
                src='/assets/play-button-svgrepo-com.svg'
                alt='play button'
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;
