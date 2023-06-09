'use client';

import React, { useEffect, useState } from 'react';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
const TMDBApiKey = process.env.NEXT_PUBLIC_API_KEY || '';
const API_URL = 'https://api.themoviedb.org/3/movie/';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';
import Item from '../Items/Item';
import getLikedMovies from '@/app/actions/getLikedMovies';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';

interface Movie {
  id: number;
  movie_id: string;
}

const FavoriteMovies = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    async function fetchDados() {
      const { data, error } = await supabaseClient
        .from('liked_movies')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        console.error(error);
        return;
      }

      const convertedData = data.map((item) => ({
        id: item.id,
        movie_id: item.movie_id,
      }));

      setFavoriteMovies(convertedData);
    }
    fetchDados();
  }, [supabaseClient, user?.id]);

  console.log(favoriteMovies);

  useEffect(() => {
    setIsLoading(true);

    async function fetchMovieDetails() {
      if (favoriteMovies.length > 0) {
        const movieDetails = await Promise.all(
          favoriteMovies.map(async (movie) => {
            const response = await fetch(
              `${API_URL}${movie.movie_id}?api_key=${TMDBApiKey}`
            );
            const data = await response.json();
            return data;
          })
        );
        setMovies(movieDetails);
        setIsLoading(false);
        router.refresh();
      } else {
        setMovies([]);
        setIsLoading(false);
        router.refresh();
      }
    }

    fetchMovieDetails();
  }, [favoriteMovies, router]);

  return (
    <div className='mb-10'>
      {isLoading && (
        <div className='flex justify-center items-center h-40'>
          <ClipLoader color='#1d9bf0' loading={isLoading} size={40} />
        </div>
      )}

      <>
        {movies && !isLoading ? (
          <div className='flex flex-wrap lg:justify-start justify-center gap-3  max-h-[370px] min-h-[370px]'>
            {movies.map((movie) => (
              <div className='flex flex-col' key={movie.id}>
                <Item item={movie} type={'movie'} userImage />
              </div>
            ))}
          </div>
        ) : null}
      </>
    </div>
  );
};

export default FavoriteMovies;
