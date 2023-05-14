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

interface ItemsCarouselProps {
  explore?: boolean;
  urltype: string;
  title?: string;
  type: string;
}
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const ItemsCarousel: React.FC<ItemsCarouselProps> = ({
  urltype,
  title,
  type,
  explore,
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
      setItems(response?.data?.results);
    };

    fetchData();
  }, []);

  return (
    <div className=' py-10 pl-10   '>
      <div className='flex items-center gap-2 pb-5 '>
        <p className='text-xl   '>{title}</p>

        {explore && (
          <Link
            href={{
              pathname: '/explorer',
              query: { title: title, urltype: urltype },
            }}
          >
            <div className='text-sky-500 hover:text-sky-600 transition  text-sm'>
              Explore all
            </div>
          </Link>
        )}
      </div>
      <div>
        <Carousel>
          {items.map((item) => (
            <div key={item.id}>
              <Link
                href={
                  type === 'movie' || 'serie'
                    ? `${
                        type === 'movie'
                          ? `movie/${item.id}`
                          : `serie/${item.id}`
                      }`
                    : `person/${item.id}`
                }
              >
                <LazyLoadImage
                  src={
                    item.poster_path
                      ? `https://image.tmdb.org/t/p/original${item.poster_path}`
                      : '/assets/placeholder.jsx'
                  }
                  alt={item.name || item.title}
                  className='imageComponent min-w-[240px] min-h-[350px] bg-[#202124]'
                  threshold={0}
                  effect='opacity'
                />
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
                  <div>person</div>
                  <div>person</div>
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
