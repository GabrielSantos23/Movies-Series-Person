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
import Item from '../Items/Item';

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

  console.log(items);

  return (
    <>
      {items.length !== 0 && (
        <div
          className={`py-10 ${
            type !== 'person' && type !== 'similar' && 'pl-10'
          }`}
        >
          <div className='flex items-center gap-2 pb-5 '>
            <p className='text-xl   '>{title}</p>

            {explore && (
              <Link
                href={{
                  pathname: '/explorer',
                  query: { title: title, urltype: urltype, type: type },
                }}
              >
                <div
                  className={`${
                    type === 'similar'
                      ? 'hidden'
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
                <Item
                  key={item.id}
                  item={item}
                  type={type}
                  person={type === 'person'}
                  url={url}
                />
              ))}
            </Carousel>
          </div>
        </div>
      )}
    </>
  );
};

export default ItemsCarousel;
