'use client';

import React, { useEffect, useState } from 'react';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
const TMDBApiKey = process.env.NEXT_PUBLIC_API_KEY || '';
const API_URL = 'https://api.themoviedb.org/3/tv/';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';

interface tvShow {
  id: number;
  name: string;
  tvShowId: string;
  overview: string;
  poster_path: string;
  vote_average: number;
}

const FavoriteTvShows = () => {
  const [favoriteTvShows, setFavoriteTvShows] = useState<tvShow[]>([]);
  const [TvShows, setTvShows] = useState<tvShow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchFavoriteTvShows() {
      try {
        const response = await fetch('/api/myfavoritesTvShows');
        const data = await response.json();
        setFavoriteTvShows(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchFavoriteTvShows();
  }, []);

  useEffect(() => {
    async function fetchTvShowDetails() {
      if (favoriteTvShows.length > 0) {
        setIsLoading(true);
        const tvShowDetails = await Promise.all(
          favoriteTvShows.map(async (tv) => {
            const response = await fetch(
              `${API_URL}${tv.tvShowId}?api_key=${TMDBApiKey}`
            );
            const data = await response.json();
            return data;
          })
        );
        setTvShows(tvShowDetails);
        setIsLoading(false);
      } else {
        setTvShows([]);
        setIsLoading(false);
      }
    }

    fetchTvShowDetails();
  }, [favoriteTvShows]);

  return (
    <div>
      {isLoading ? ( // Verifica se está carregando
        <div className='flex justify-center items-center h-40'>
          <ClipLoader color='#1d9bf0' loading={isLoading} size={40} />
        </div>
      ) : TvShows.length > 0 ? ( // Verifica se há filmes para exibir
        <div className='flex flex-wrap gap-3'>
          {TvShows.map((tv) => (
            <div className='flex flex-col' key={tv.id}>
              <Link href={`/tv/${tv.id}`}>
                <img
                  className='w-64'
                  src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
                  alt={`${tv.name} poster`}
                />
              </Link>
              <h3 className='max-w-[256px] line-clamp-1 mt-1'>{tv.name}</h3>
              <div className='flex gap-3 items-center mt-1'>
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
                  value={tv?.vote_average / 2}
                />
                <p className='text-stone-500 text-sm'>{tv?.vote_average}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex justify-center'>No Tv shows favorited</div>
      )}
    </div>
  );
};

export default FavoriteTvShows;
