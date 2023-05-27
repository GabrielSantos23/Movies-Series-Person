import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Placeholder from '../../../public/assets/placeholder';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { LazyLoadImage } from 'react-lazy-load-image-component';
// import 'react-lazy-load-image-component/src/effects/blur.css';
import Link from 'next/link';
import Item from '../Items/Item';
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
        <div key={item.id} className='flex flex-col rounded-sm w-[240px] mb-5'>
          <Item item={item} type={item.name ? `tv` : `movie`} />
        </div>
      ))}
    </div>
  );
};

export default ActorKnowFor;
