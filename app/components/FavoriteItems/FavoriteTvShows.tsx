'use client';

import React, { useEffect, useState } from 'react';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
const TMDBApiKey = process.env.NEXT_PUBLIC_API_KEY || '';
const API_URL = 'https://api.themoviedb.org/3/tv/';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';
import Item from '../Items/Item';

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
    <div className='mb-10'>
      {isLoading ? (
        <div className='flex justify-center items-center h-40 '>
          <ClipLoader color='#1d9bf0' loading={isLoading} size={40} />
        </div>
      ) : TvShows.length > 0 ? (
        <div className='flex flex-wrap gap-3  lg:justify-start justify-center'>
          {TvShows.map((tv) => (
            <div
              className='flex flex-col max-h-[370px] min-h-[370px]'
              key={tv.id}
            >
              <Item item={tv} type={'tv'} />
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
