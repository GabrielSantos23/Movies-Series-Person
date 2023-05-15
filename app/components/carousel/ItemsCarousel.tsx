'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import Carousel from './Carousel';
import Link from 'next/link';
import Image from 'next/image';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Rating } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './carouselStyle.css';
import Placeholder from './../../../public/assets/placeholder';

interface ItemsCarouselProps {
  explore?: boolean;
  urltype: string;
  title?: string;
  type: string;
  url?: string;
  serie?: boolean;
}
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const ItemsCarousel: React.FC<ItemsCarouselProps> = ({
  urltype,
  title,
  type,
  explore,
  url,
  serie,
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/${urltype}`,
        {
          params: {
            api_key: apiKey,
          },
        }
      );
      {
        response?.data?.results
          ? setItems(response?.data?.results)
          : setItems(response?.data?.cast);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className={`py-10 ${type !== 'person' && type !== 'similar' && 'pl-10'}`}
    >
      <div className='flex items-center gap-2 pb-5 '>
        <p className='text-xl   '>{title}</p>

        {explore && (
          <Link
            href={{
              pathname: '/explorer',
              query: { title: title, urltype: urltype },
            }}
          >
            <div
              className={`${
                type === 'similar'
                  ? 'text-transparent'
                  : 'text-sky-500 hover:text-sky-600'
              }   transition  text-sm`}
            >
              Explore all
            </div>
          </Link>
        )}
      </div>
      <div>
        <Carousel>
          {items?.map((item) => (
            <div key={item.id} className=' '>
              <Link href={`/${url ? url : type}/${item.id}`}>
                {item.profile_path || item.poster_path ? (
                  <LazyLoadImage
                    src={
                      type === 'person'
                        ? `https://image.tmdb.org/t/p/original${item.profile_path}`
                        : item.poster_path
                        ? `https://image.tmdb.org/t/p/original${item.poster_path}`
                        : '/assets/placeholder.jsx'
                    }
                    alt={item.name || item.title}
                    className='imageComponent min-w-[240px] min-h-[350px] bg-[#202124]'
                    threshold={0}
                    effect='opacity'
                  />
                ) : (
                  <Placeholder />
                )}
              </Link>
              <div>
                <p className=' line-clamp-1'>{item.title || item.name}</p>
              </div>
              {explore && (
                <div className='flex gap-2 mt-1'>
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
                    value={item?.vote_average / 2}
                  />
                  <p className='text-neutral-500 text-sm'>
                    {item?.vote_average}
                  </p>
                </div>
              )}
              {!explore && (
                <>
                  <p className='text-stone-500 text-sm'>{item.character}</p>
                </>
              )}
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default ItemsCarousel;
