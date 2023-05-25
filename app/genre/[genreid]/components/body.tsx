'use client';

import HelmetComponent from '@/app/components/Helmet';
import Item from '@/app/components/Items/Item';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
import InfiniteScroll from 'react-infinite-scroll-component';
import { ClipLoader } from 'react-spinners';

const Body = () => {
  const [item, setItem] = useState([]);
  const params = useParams();
  const searchParams = useSearchParams();
  const objectid = params.genreid;
  const type = searchParams.get('type');
  const title = searchParams.get('title');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = () => {
    const url = `https://api.themoviedb.org/3/discover/${type}?api_key=${apiKey}&page=${page}&with_genres=${objectid}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const newMovies = data.results.map((movie: any) => ({
          movie,
        }));
        if (data.results.length > 0) {
          setItem((prevMovies): any => [...prevMovies, ...newMovies]);
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

  console.log(item);

  return (
    <>
      <HelmetComponent title={`${type} Genre: ${title}`} />
      <h1
        className={`flex justify-center  lg:justify-start lg:ml-10 mt-10 text-2xl
        } `}
      >
        <span
          className={`
        ${type === 'tv' ? 'uppercase' : 'capitalize'}
       mr-1
       `}
        >
          {type}
        </span>
        Genre: {title}
      </h1>

      <InfiniteScroll
        dataLength={item.length}
        next={fetchMovies}
        className='mb-10 '
        hasMore={hasMore}
        loader={
          <div className='flex justify-center items-center mb-10  '>
            <ClipLoader color='#1d9bf0' size={20} />
          </div>
        }
      >
        <div className='flex flex-wrap justify-center lg:justify-start lg:ml-10 mt-10 gap-2'>
          {item.map((it: any) => (
            <div
              key={it.id}
              className='flex flex-col rounded-sm w-[240px] mb-5  '
            >
              <Item item={it.movie} type={type} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default Body;
