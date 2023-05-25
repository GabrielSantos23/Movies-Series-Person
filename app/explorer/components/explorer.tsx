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
import Placeholder from '../../../public/assets/placeholder';
import Item from '@/app/components/Items/Item';

interface Movie {
  id: number;
  name: string;
  title: string;
  poster_path: string;
  vote_average: number;
}

const Explorer = () => {
  const searchParams = useSearchParams();
  const title = searchParams && searchParams.get('title');
  const urltype = searchParams && searchParams.get('urltype');
  const type = searchParams && searchParams.get('type');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  console.log(movies);

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
        if (data.results.length > 0) {
          setMovies((prevMovies) => [...prevMovies, ...newMovies]);
          setPage((prevPage) => prevPage + 1);
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.log('Error fetching movies:', error);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <HelmetComponent title={'Explore'} />
      <h1 className='text-2xl font-normal ml-10 my-10 '>{title}</h1>
      <InfiniteScroll
        dataLength={movies.length}
        next={fetchMovies}
        hasMore={hasMore}
        loader={
          <div className='flex justify-center items-center mb-10  '>
            <ClipLoader color='#1d9bf0' size={20} />
          </div>
        }
      >
        <div className='flex gap-2 lg:ml-10 lg:justify-start justify-center flex-wrap'>
          {movies.map((movie) => (
            <div
              className='flex flex-col rounded-sm w-[240px] mb-5'
              key={movie.id}
            >
              <Item key={movie.id} item={movie} type={type} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default Explorer;
