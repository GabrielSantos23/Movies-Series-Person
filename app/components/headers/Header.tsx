'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rating, useMediaQuery } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { BsFillPlayFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import HeaderMobile from './HeaderMobile';
import { signIn, useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LazyLoadImage } from 'react-lazy-load-image-component';

interface HeaderProps {
  urltype: string;
}

const Header: React.FC<HeaderProps> = ({ urltype }) => {
  const [showImage, setShowImage] = useState(false);
  const [movie, setMovie] = useState<any>({});
  const [numSeasons, setNumSeasons] = useState<number | null>(null);
  const [numReviews, setNumReviews] = useState<number | null>(null);
  const [usRating, setUsRating] = useState<string | null>(null);
  const [showContent, setShowContent] = useState(false);
  const matches = useMediaQuery('(min-width:1024px)');
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    setShowImage(true);
    setTimeout(() => {
      setShowContent(true);
    }, 500);
  }, []);

  const watchTrailer = async () => {
    try {
      const apiKey = '281d112a5f3e634a22a7bbe6657f040d';
      const response = await axios.get(
        `https://api.themoviedb.org/3/${movie.media_type}/${movie.id}/videos?api_key=${apiKey}&language=en-US`
      );
      const trailers = response.data.results.filter(
        (trailer: any) => trailer.type === 'Trailer'
      );
      if (trailers.length > 0) {
        const trailerKey = trailers[0].key;
        window.open(`https://www.youtube.com/watch?v=${trailerKey}`, '_blank');
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/${urltype}api_key=${apiKey}`)
      .then((response) => {
        const results = response.data.results;
        const newIndex = Math.floor(Math.random() * results.length);
        setMovie(results[newIndex]);
      });
  }, [apiKey, urltype]);

  useEffect(() => {
    if (movie && movie.id) {
      const mediaType = movie.media_type === 'tv' ? 'tv' : 'movie';
      axios
        .get(
          `https://api.themoviedb.org/3/${mediaType}/${movie.id}/release_dates?api_key=${apiKey}`
        )
        .then((response) => {
          const usRelease = response.data.results.find(
            (release: any) => release.iso_3166_1 === 'US'
          );
          if (usRelease) {
            setUsRating(usRelease.release_dates[0].certification);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [movie, apiKey]);

  useEffect(() => {
    if (movie && movie.id) {
      const mediaType = movie.media_type === 'tv' ? 'tv' : 'movie';
      axios
        .get(
          `https://api.themoviedb.org/3/${mediaType}/${movie.id}/reviews?api_key=${apiKey}&language=en-US`
        )
        .then((response) => {
          const numReviews = response.data.total_results;
          setNumReviews(numReviews);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [movie, apiKey]);

  useEffect(() => {
    if (movie && movie.media_type === 'tv') {
      axios
        .get(`https://api.themoviedb.org/3/tv/${movie.id}?api_key=${apiKey}`)
        .then((response) => {
          setNumSeasons(response.data.number_of_seasons);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [movie, apiKey]);

  return (
    <div className='h-[70vh] bg-black'>
      {movie && (
        <>
          {matches ? (
            <div className='relative flex h-[70vh]  w-full bg-black'>
              <motion.div className='div-40 absolute  z-[2000] flex h-[70vh] w-[40%]  flex-col justify-center pl-10 '>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'linear', duration: 0.5 }}
                >
                  <Link
                    href={movie.name ? `/tv/${movie.id}` : `/movie/${movie.id}`}
                  >
                    <h1 className=' z-[2000] w-[110%] text-4xl font-normal'>
                      {movie?.title || movie?.name}
                    </h1>
                  </Link>
                  <div className='mt-5 flex gap-2'>
                    {movie?.vote_average && (
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
                    )}
                    {numReviews && (
                      <p className='text-neutral-500'>{numReviews} Reviews</p>
                    )}
                    {movie?.release_date && !movie?.media_type && (
                      <p className='text-neutral-500'>
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    )}

                    {movie?.media_type === 'tv' && numSeasons && (
                      <p className='text-neutral-500'>{numSeasons} seasons</p>
                    )}
                    {usRating && (
                      <p className='text-neutral-500'>{usRating} </p>
                    )}
                  </div>
                  <div className='z-[2000] mt-5 line-clamp-3 w-[110%]'>
                    {movie?.overview}
                  </div>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: imageLoaded ? 1 : 0 }}
                transition={{ duration: 0.5, type: 'linear' }}
                className='flex-end  right-0 flex h-[70vh] w-[70%] items-end'
              >
                <LazyLoadImage
                  className='absolute right-0 top-0 h-[70vh] w-full object-cover opacity-70'
                  src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                  alt={movie?.name || movie?.title}
                  threshold={0}
                  effect='opacity'
                  afterLoad={handleImageLoad}
                />
              </motion.div>
            </div>
          ) : (
            <HeaderMobile
              showImage={showImage}
              movie={movie}
              numSeasons={numSeasons}
              numReviews={numReviews}
              usRating={usRating}
              showContent={showContent}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
