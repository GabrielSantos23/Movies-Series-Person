'use client';

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import placeholder from '../../../public/assets/placeholder.png';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import HelmetComponent from '../../components/Helmet';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Placeholder from '../../../public/assets/placeholder';

const Search = () => {
  const [searchResult, setSearchResult] = useState<any>([]);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get('q');
  // const query = router.query.q;

  const posterRef = useRef(null);

  const tmdbkey = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    if (!query) {
      return;
    }
    setPage(1);
    setSearchResult([]);
  }, [query]);

  useEffect(() => {
    if (!query) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${tmdbkey}&page=${page}`
        );
        setSearchResult((prevResults: any) => [
          ...prevResults,
          ...data.results,
        ]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [query, page, router, tmdbkey]);

  const fetchMoreData = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return (
    <>
      <HelmetComponent title={'Search'} />

      <h1 className='flex mb-5 ml-10 mt-32 text-2xl '>Results for: {query}</h1>
      <InfiniteScroll
        dataLength={searchResult.length}
        next={fetchMoreData}
        hasMore={true}
        scrollThreshold={0.9}
        loader={<h4>Loading...</h4>}
        className='flex flex-wrap ml-10 gap-3'
      >
        {searchResult.map((result: any, index: any) => (
          <div className='flex flex-col flex-wrap  items-start' key={index}>
            <div
              style={{
                backgroundColor: '#202124',
                width: '230px',
                height: '350px',
              }}
            >
              <Link
                href={
                  result.media_type === 'tv'
                    ? `/tv/${result.id}`
                    : result.media_type === 'movie'
                    ? `/movie/${result.id}`
                    : `/person/${result.id}`
                }
              >
                {result.poster_path || result.profile_path ? (
                  <LazyLoadImage
                    className='outline-none w-full h-[350px] bg-[#202124]'
                    src={
                      result.poster_path || result.profile_path
                        ? `https://image.tmdb.org/t/p/w500/${
                            result.poster_path || result.profile_path
                          }`
                        : placeholder.toString()
                    }
                    onError={(e: any) => {
                      e.target.onerror = null;
                      e.target.src = placeholder;
                    }}
                    threshold={0}
                    effect='opacity'
                  />
                ) : (
                  <Placeholder />
                )}
              </Link>
            </div>

            <div className='text-base max-w-[220px] mt-3  line-clamp-1'>
              {result.title || result.name}
            </div>
            {result?.vote_average ? (
              <div className='flex items-center gap-3'>
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
                  value={result?.vote_average / 2}
                />
                <p className='text-stone-500 text-sm'>{result?.vote_average}</p>
              </div>
            ) : (
              ''
            )}
          </div>
        ))}
      </InfiniteScroll>
    </>
  );
};

export default Search;
