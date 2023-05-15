import React from 'react';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { motion } from 'framer-motion';

import Link from 'next/link';
import Image from 'next/image';
import Modal from '../modals/ModalSeries';
import HelmetComponent from '../Helmet';

interface HeaderMobileProps {
  showImage: boolean;
  movie: any;
  numSeasons: number | null;
  numReviews: number | null;
  usRating: string | null;
  showContent: boolean;
}

const HeaderMobile: React.FC<HeaderMobileProps> = ({
  showImage,
  movie,
  numSeasons,
  numReviews,
  usRating,
  showContent,
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
  return (
    <div
      className='h-[70vh] lg:hidden bg-black w-full'
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      <div className='w-full headerMobileBG relative h-full'>
        <div className='w-full h-full flex-col justify-end flex z-[1000] absolute px-5'>
          <Link href={movie.name ? `/serie/${movie.id}` : `/movie/${movie.id}`}>
            <h1 className='font-normal text-2xl'>
              {movie.title || movie.name}
            </h1>
          </Link>
          <div className='flex gap-2 mt-5'>
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
          <div className='mt-5 text-sm mb-5 w-full line-clamp-2 '>
            {movie?.overview}
          </div>
        </div>
        <div className='w-full h-full flex items-center justify-center'>
          <Image
            width={50}
            height={50}
            src='/assets/play-button-svgrepo-com.svg'
            alt='play button'
          />
        </div>
      </div>
    </div>
  );
};

export default HeaderMobile;
