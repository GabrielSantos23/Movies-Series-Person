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
import AddToFavoriteButton from '../Buttons/AddTofavorites';
import Modal from '../modals/Modal';
interface HeaderDetailsProps {
  type: 'movie' | 'tv';
  link: string;
}

const HeaderDetails: React.FC<HeaderDetailsProps> = ({ type, link }) => {
  const params = useParams();
  const objectid = params;

  const id = (objectid && objectid.movieid) || (objectid && objectid.tvid);
  const [showImage, setShowImage] = useState(false);
  const [movie, setMovie] = useState<any>([]);
  const [numReviews, setNumReviews] = useState(null);
  const [usRating, setUsRating] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;
  const [showContent, setShowContent] = useState(false);
  const matches = useMediaQuery('(min-width:1100px)');
  const [SocialMedia, setSocialMedia] = useState<any>([]);

  const [modalOpen, setModalOpen] = useState(false);

  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleEpisodeClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
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

  const handleWatchNowClick = () => {
    const movieSection = document.getElementById('movie');
    if (movieSection) {
      movieSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const imdbid = movie?.imdb_id ? movie?.imdb_id : SocialMedia?.imdb_id;
  return (
    <div className='h-[70vh] bg-black'>
      {movie && (
        <>
          <HelmetComponent
            title={`${movie?.title || movie?.name} (${new Date(
              movie?.release_date || movie?.first_air_date
            ).getFullYear()})`}
          />
          {modalOpen && (
            <Modal video onClose={() => setModalOpen(false)} isOpen={modalOpen}>
              <div className='relative w-full overflow-hidden pt-[56.25%]'>
                <iframe
                  src={`${link}/${imdbid}`}
                  className='absolute top-0 h-full w-full'
                  allowFullScreen
                  allow='picture-in-picture'
                />
              </div>
            </Modal>
          )}
          <div className='relative hidden w-full bg-black lg:flex'>
            <motion.div className='div-40 absolute  z-[2000] flex h-[70vh] w-[40%]  flex-col justify-center pl-10 '>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'linear', duration: 0.5 }}
              >
                <h1 className=' z-[2000] w-[110%] text-4xl font-normal'>
                  {movie?.title || movie?.name}
                </h1>
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
                <div className='z-[2000] mt-5 line-clamp-3 w-[110%]'>
                  {movie?.overview}
                </div>
                <div className='mt-5 flex items-center gap-2'>
                  <Button onClick={handleWatchNowClick}>
                    <BsFillPlayFill /> &nbsp; Watch Now
                  </Button>
                  <Button secondary onClick={watchTrailer}>
                    <BsFillPlayFill /> &nbsp; Watch Trailer
                  </Button>
                  <AddToFavoriteButton id={id} type={type} />
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: imageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5, type: 'linear' }}
              className='flex-end  right-0 flex h-[100%] w-[70%] items-end'
            >
              <LazyLoadImage
                className='absolute right-0 h-[70vh] w-full object-cover opacity-70 '
                src={`https://image.tmdb.org/t/p/original/${movie.backdrop_path}`}
                alt={movie?.name || movie?.title}
                threshold={0}
                effect='opacity'
                afterLoad={handleImageLoad}
              />
            </motion.div>
          </div>

          <HeaderMobile
            showImage={showImage}
            movie={movie}
            numSeasons={movie?.number_of_seasons}
            numReviews={numReviews}
            usRating={usRating}
            showContent={showContent}
            handleEpisodeClick={handleEpisodeClick}
          />
        </>
      )}
    </div>
  );
};

export default HeaderDetails;
