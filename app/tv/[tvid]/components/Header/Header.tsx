'use client';

import { apiKey } from '@/envexports';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Button } from '@mui/material';
import Button2 from '@/app/components/Buttons/Button2';
import AddToFavoriteButton from '@/app/components/Buttons/AddTofavorites';
import './Header.css';
interface Genre {
  id: number;
  name: string;
}

const Header = () => {
  const params = useParams();
  const objectid = params;
  const [tv, setTv] = useState<any>([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [genres, setGenres] = useState([]);

  const id = objectid && objectid.tvid;

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`
      )
      .then((response) => {
        const results = response.data;
        setTv(results);
      });
  }, []);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const formatVoteAverage = (
    voteAverage: number | undefined | null
  ): string => {
    if (voteAverage !== undefined && voteAverage !== null) {
      return voteAverage.toFixed(1);
    }
    return '';
  };

  const getYearFromReleaseDate = (releaseDate: string | null | undefined) => {
    if (releaseDate) {
      const parts = releaseDate.split('-');
      return parts[0];
    }
    return '';
  };

  const [genreNames, setGenreNames] = useState<Genre[]>([]);
  const getGenreName = (genreId: number) => {
    const genre = genreNames.find(
      (genre: { id: number }) => genre.id === genreId
    );
    return genre ? genre.name : '';
  };
  const firstGenre = genreNames.length > 0 ? getGenreName(genres[0]) : '';

  return (
    <div className='relative h-[70vh] w-full bg-black '>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 0.5, type: 'linear' }}
        className='flex-end  right-0 flex  '
      >
        <div className=' test absolute z-10 h-full w-full rounded-md'></div>
        <LazyLoadImage
          className='absolute  h-[70vh] w-screen rounded-md object-cover opacity-50'
          src={`https://image.tmdb.org/t/p/original/${tv.backdrop_path}`}
          alt={tv?.name || tv?.title}
          threshold={0}
          effect='opacity'
          afterLoad={handleImageLoad}
        />
        <div className=' absolute  h-full   '>
          <div className='flex h-full w-full flex-col   justify-center   px-10  md:px-32  '>
            <div className='flex w-full flex-col justify-center '>
              <h1 className='line-clamp-2 text-4xl font-bold  md:text-6xl'>
                {tv?.name || tv?.title}
              </h1>
              <div className='flex flex-wrap gap-5 text-custom-gray'>
                {tv.vote_average !== undefined && tv.vote_average !== null && (
                  <p>{formatVoteAverage(tv.vote_average)}/10</p>
                )}

                <p>
                  {tv.release_date
                    ? `${getYearFromReleaseDate(tv.release_date)}`
                    : `${getYearFromReleaseDate(tv.first_air_date)}`}
                </p>
                <p>{tv.name ? 'TV Series' : 'Movie'}</p>
                {firstGenre && <p>{firstGenre}</p>}
              </div>
            </div>

            <div>
              <p className='mt-5 line-clamp-4 lg:w-3/4 xl:w-2/4  '>
                {tv.overview}
              </p>
            </div>
            <div className='z-10 mt-10 flex gap-5 '>
              <Button2
                className='w-2/4 rounded-none bg-[#1d9bf0] text-white md:w-[150px]'
                onClick={() => {}}
              >
                Play
              </Button2>
              <AddToFavoriteButton id={id} type='tv' />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Header;
