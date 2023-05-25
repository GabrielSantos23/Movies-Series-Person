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
import Item from '@/app/components/Items/Item';
import { ClipLoader } from 'react-spinners';

const Search = () => {
  const [searchResult, setSearchResult] = useState<any>([]);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [hasMore, setHasMore] = useState(true);

  const query = searchParams && searchParams.get('q');
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
        if (data.results.length > 0) {
          setSearchResult((prevResults: any) => [
            ...prevResults,
            ...data.results,
          ]);
        } else {
          setHasMore(false);
        }
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
      <div className='flex flex-col'>
        <InfiniteScroll
          dataLength={searchResult.length}
          next={fetchMoreData}
          hasMore={hasMore}
          scrollThreshold={0.9}
          loader={
            <div className='flex justify-center items-center mb-10  '>
              <ClipLoader color='#1d9bf0' size={20} />
            </div>
          }
          className='flex flex-wrap ml-10 gap-3'
        >
          {searchResult.map((result: any, index: any) => (
            <div className='flex flex-col flex-wrap  items-start' key={index}>
              <div className='flex flex-col rounded-sm w-[240px] mb-5'>
                <Item
                  item={result}
                  type={
                    result.media_type === 'tv'
                      ? `tv`
                      : result.media_type === 'movie'
                      ? `movie`
                      : `person`
                  }
                  person={
                    result.media_type !== 'tv' && result.media_type !== 'movie'
                  }
                />
              </div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
    </>
  );
};

export default Search;
