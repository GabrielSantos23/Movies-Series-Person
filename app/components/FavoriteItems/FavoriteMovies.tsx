'use client';

import React, { useEffect, useState } from 'react';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
const TMDBApiKey = process.env.NEXT_PUBLIC_API_KEY || '';
const API_URL = 'https://api.themoviedb.org/3/movie/';
import { ClipLoader } from 'react-spinners';
import Link from 'next/link';
import Item from '../Items/Item';

interface Movie {
  id: number;
  title: string;
  movieId: string;
  overview: string;
  poster_path: string;
  vote_average: number;
}

const FavoriteMovies = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchFavoriteMovies() {
      try {
        const response = await fetch('/api/myfavoritesmovies');
        const data = await response.json();
        setFavoriteMovies(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchFavoriteMovies();
  }, []);

  useEffect(() => {
    async function fetchMovieDetails() {
      if (favoriteMovies.length > 0) {
        setIsLoading(true);
        const movieDetails = await Promise.all(
          favoriteMovies.map(async (movie) => {
            const response = await fetch(
              `${API_URL}${movie.movieId}?api_key=${TMDBApiKey}`
            );
            const data = await response.json();
            return data;
          })
        );
        setMovies(movieDetails);
        setIsLoading(false);
      } else {
        setMovies([]); // Define o array como vazio quando não há filmes favoritos
        setIsLoading(false);
      }
    }

    fetchMovieDetails();
  }, [favoriteMovies]);

  console.log(favoriteMovies);

  return (
    <div className='mb-10'>
      {isLoading ? (
        <div className='flex justify-center items-center h-40'>
          <ClipLoader color='#1d9bf0' loading={isLoading} size={40} />
        </div>
      ) : movies.length > 0 ? (
        <div className='flex flex-wrap lg:justify-start justify-center gap-3  max-h-[370px] min-h-[370px]'>
          {movies.map((movie) => (
            <div className='flex flex-col' key={movie.id}>
              <Item item={movie} type={'movie'} user />
            </div>
          ))}
        </div>
      ) : (
        <div className='flex justify-center'>No movies favorited</div>
      )}
    </div>
  );
};

export default FavoriteMovies;
