'use client';

import React, { useState, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import placeholder from '../../../public/assets/placeholder';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import HelmetComponent from '../../components/Helmet';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

interface Movie {
  id: number;
  name: string;
  title: string;
  poster_path: string;
  vote_average: number;
}

const Explorer = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get('title');
  const urltype = searchParams.get('urltype');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchMovies();
  }, []);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const fetchMovies = () => {
    const url = `https://api.themoviedb.org/3/${urltype}?api_key=${apiKey}&page=${page}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const newMovies = data.results.map((movie: any) => ({
          id: movie.id,
          name: movie.name,
          title: movie.title,
          poster_path: movie.poster_path,
          vote_average: movie.vote_average,
        }));
        setMovies((prevMovies) => [...prevMovies, ...newMovies]);
        setPage((prevPage) => prevPage + 1);
      })
      .catch((error) => {
        console.log('Error fetching movies:', error);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  console.log(movies);
  return (
    <div>
      <HelmetComponent title={'Explore'} />
      <h1 className='text-2xl font-normal ml-10 my-10 '>{title}</h1>
      <InfiniteScroll
        dataLength={movies.length}
        next={fetchMovies}
        hasMore={true}
        loader={<ClipLoader color='#1d9bf0' size={20} />}
      >
        <div className='flex gap-2 ml-10 flex-wrap'>
          {movies.map((movie) => (
            <div className='flex flex-col rounded-sm w-[220px]' key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title || movie.name}
                className=''
              />
              <h2 className='font-normal text-base line-clamp-1'>
                {movie.title || movie.name}
              </h2>

              <div className='flex items-center gap-3 '>
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
                  value={movie?.vote_average / 2}
                />
                <div className='text-stone-500 text-sm'>
                  {movie?.vote_average}
                </div>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Explorer;
