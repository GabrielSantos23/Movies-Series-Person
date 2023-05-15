'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Rating, useMediaQuery } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { BsFillPlayFill } from 'react-icons/bs';
import { motion } from 'framer-motion';
import HeaderMobile from './HeaderMobile';
import Image from 'next/image';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useSearchParams, useParams, usePathname } from 'next/navigation';
import HelmetComponent from '../Helmet';
import Button from '../Buttons/Button';
interface HeaderDetailsProps {
  type: 'movie' | 'tv';
  link: string;
}

const HeaderDetails: React.FC<HeaderDetailsProps> = ({ type, link }) => {
  const params = useParams();
  const objectid = params;

  const id = objectid.movieid || objectid.tvid;
  const [showImage, setShowImage] = useState(false);
  const [movie, setMovie] = useState<any>([]);
  const [numReviews, setNumReviews] = useState(null);
  const [usRating, setUsRating] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const [showContent, setShowContent] = useState(false);
  const matches = useMediaQuery('(min-width:1100px)');
  const [showModal, setShowModal] = useState(false);
  const [SocialMedia, setSocialMedia] = useState<any>([]);

  console.log(
    `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=en-US`
  );

  const handleEpisodeClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}&language=en-US`
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
    if (movie && id) {
      axios
        .get(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US`
        )
        .then((response) => {
          const results = response.data;
          setMovie(results);
        });
      axios
        .get(
          `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=credits,production_companies,external_ids`
        )
        .then((response) => {
          const socialMedia = response.data.external_ids;

          setSocialMedia(socialMedia);
        });
    }
  }, []);

  useEffect(() => {
    if (movie && id) {
      const mediaType = movie.media_type === 'tv' ? 'tv' : 'movie';
      axios
        .get(
          `https://api.themoviedb.org/3/${mediaType}/${id}/release_dates?api_key=${apiKey}`
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
  }, [movie]);

  useEffect(() => {
    if (movie && id) {
      axios
        .get(
          `https://api.themoviedb.org/3/${type}/${id}/reviews?api_key=${apiKey}&language=en-US`
        )
        .then((response) => {
          const numReviews = response.data.total_results;
          setNumReviews(numReviews);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [movie]);

  const imdbid = movie?.imdb_id ? movie?.imdb_id : SocialMedia?.imdb_id;
  return (
    <>
      <HelmetComponent
        title={`${movie?.title || movie?.name} (${new Date(
          movie?.release_date || movie?.first_air_date
        ).getFullYear()})`}
      />
      <div className='w-full h-[70vh] hidden bg-black lg:flex'>
        <motion.div className='div-40 w-[40%]  absolute z-[2000] pl-10 justify-center  h-[70vh] flex flex-col '>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'linear', duration: 0.5 }}
          >
            <h1 className=' w-[110%] z-[2000] font-normal text-4xl'>
              {movie?.title || movie?.name}
            </h1>
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

              {movie?.number_of_seasons ? (
                <p className='text-neutral-500'>
                  {movie?.number_of_seasons}&nbsp;
                  {movie?.number_of_seasons > 1 ? 'seasons' : 'season'}
                </p>
              ) : (
                ''
              )}
              {usRating && <p className='text-neutral-500'>{usRating} </p>}
            </div>
            <div className='mt-5 w-[110%] z-[2000] line-clamp-3'>
              {movie?.overview}
            </div>
            <div className='flex items-center gap-2 mt-5'>
              <Button onClick={() => handleEpisodeClick()}>
                <BsFillPlayFill /> &nbsp; Watch Now
              </Button>
              <Button secondary onClick={watchTrailer}>
                <BsFillPlayFill /> &nbsp; Watch Trailer
              </Button>
            </div>
          </motion.div>
        </motion.div>
        <div className='w-[70%] absolute right-0 flex items-end flex-end h-[70vh]'>
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, type: 'linear' }}
            src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
            alt={movie?.name || movie?.title}
            className='h-full w-full right-0 opacity-70 object-cover '
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </div>

      <HeaderMobile
        showImage={showImage}
        movie={movie}
        numSeasons={movie?.number_of_seasons}
        numReviews={numReviews}
        usRating={usRating}
        showContent={showContent}
      />
    </>
  );
};

export default HeaderDetails;
