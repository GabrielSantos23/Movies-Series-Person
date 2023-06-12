'use client';

import React, { useEffect, useState } from 'react';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
const TMDBApiKey = process.env.NEXT_PUBLIC_API_KEY || '';
const API_URL = 'https://api.themoviedb.org/3/tv/';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';
import Item from '../Items/Item';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

interface tvShow {
  id: number;
  serie_id: string;
}

const FavoriteTvShows = () => {
  const [favoriteTvShows, setFavoriteTvShows] = useState<tvShow[]>([]);
  const [TvShows, setTvShows] = useState<tvShow[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const router = useRouter();
  // useEffect(() => {
  //   async function fetchFavoriteTvShows() {
  //     try {
  //       const response = await fetch('/api/myfavoritesTvShows');
  //       const data = await response.json();
  //       setFavoriteTvShows(data);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   fetchFavoriteTvShows();
  // }, []);

  useEffect(() => {
    async function fetchDados() {
      const { data, error } = await supabaseClient
        .from('liked_tvshows')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        console.error(error);
        return;
      }

      const convertedData = data.map((item) => ({
        id: item.id,
        serie_id: item.serie_id,
      }));

      setFavoriteTvShows(convertedData);
    }
    fetchDados();
  }, [supabaseClient, user?.id]);

  useEffect(() => {
    async function fetchTvShowDetails() {
      if (favoriteTvShows.length > 0) {
        setIsLoading(true);
        const tvShowDetails = await Promise.all(
          favoriteTvShows.map(async (tv) => {
            const response = await fetch(
              `${API_URL}${tv.serie_id}?api_key=${TMDBApiKey}`
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
        router.refresh();
      }
    }

    fetchTvShowDetails();
  }, [favoriteTvShows, router]);

  return (
    <div className='mb-10'>
      {isLoading && (
        <div className='flex justify-center items-center h-40 '>
          <ClipLoader color='#1d9bf0' loading={isLoading} size={40} />
        </div>
      )}

      {TvShows && !isLoading && (
        <div className='flex flex-wrap gap-3  lg:justify-start justify-center'>
          {TvShows.map((tv) => (
            <div
              className='flex flex-col max-h-[370px] min-h-[370px]'
              key={tv.id}
            >
              <Item item={tv} type={'tv'} userImage />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteTvShows;
