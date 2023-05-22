import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Placeholder from '../../../public/assets/placeholder';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// import 'react-lazy-load-image-component/src/effects/blur.css';
import Link from 'next/link';
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

interface ActorKnowForProps {
  id: string | string[] | null;
}

const ActorKnowFor: React.FC<ActorKnowForProps> = ({ id }) => {
  const [credits, setCredits] = useState<any>([]);

  useEffect(() => {
    if (id) {
      const fetchCredits = async () => {
        const response = await axios.get(
          `https://api.themoviedb.org/3/person/${id}/combined_credits`,
          {
            params: {
              api_key: apiKey,
            },
          }
        );
        const sortedCredits = response.data.cast.sort(
          (a: any, b: any) => b.popularity - a.popularity
        );
        setCredits(sortedCredits);
      };
      fetchCredits();
    }
  }, [id]);

  return (
    <div className='flex justify-center lg:justify-start flex-wrap gap-2 mt-5 mb-20'>
      {credits.map((item: any, index: any) => (
        <div key={index} className='mb-5'>
          <div className='bg-[#202124] h-[320px]'>
            <Link href={item.name ? `/tv/${item.id}` : `/movie/${item.id}`}>
              {item.poster_path ? (
                <LazyLoadImage
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt=''
                  width='220px'
                  threshold={0}
                  effect='opacity'
                />
              ) : (
                <Placeholder />
              )}
            </Link>
          </div>
          <p className='max-w-[220px] mt-3 line-clamp-1'>
            {item.name || item.title}
          </p>

          <div className='flex gap-2 items-center '>
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
            <p className='text-stone-500 text-sm'>{item?.vote_average}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActorKnowFor;
