'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import './ItemStyle.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Placeholder from '@/public/assets/placeholder';
import { Rating } from '@mui/material';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { motion } from 'framer-motion';
import { BsBookmark, BsFillBookmarkFill, BsFillPlayFill } from 'react-icons/bs';
import useAuthModal from '@/hooks/useAuthModal';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ItemProps {
  item: {
    id?: number | string | undefined;
    poster_path?: string | undefined;
    title?: string | undefined;
    name?: string | undefined;
    vote_average?: number | null | undefined;
    character?: string;
    profile_path?: string | undefined;
  };
  type?: string | null;
  person?: boolean;
  url?: string;
  userImage?: boolean;
}

const Item: React.FC<ItemProps> = ({ item, type, person, url, userImage }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authModal = useAuthModal();
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const router = useRouter();

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    const Ttype = type === 'movie' ? 'liked_movies' : 'liked_tvshows';
    const TypeId = type === 'movie' ? 'movie_id' : 'serie_id';

    const fetchData = async () => {
      const { data, error } = await supabaseClient
        .from(Ttype)
        .select('*')
        .eq('user_id', user.id)
        .eq(TypeId, item.id)
        .single();

      if (!error && data) {
        setIsFavorite(true);
      }
    };
    fetchData();
  }, [item.id, supabaseClient, user?.id]);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    if (!user) {
      setIsLoading(false);
      return authModal.onOpen();
    }
    const Ttype = type === 'movie' ? 'liked_movies' : 'liked_tvshows';
    const TypeId = type === 'movie' ? 'movie_id' : 'serie_id';

    if (isFavorite) {
      const { error } = await supabaseClient
        .from(Ttype)
        .delete()
        .eq('user_id', user.id)
        .eq(TypeId, item.id);
      if (error) {
        toast.error(error.message);
        setIsLoading(false);
      } else {
        setIsFavorite(false);
        setIsLoading(false);
      }
    } else {
      const { error } = await supabaseClient.from(Ttype).insert({
        [TypeId]: item.id,
        user_id: user.id,
      });
      if (error) {
        toast.error(error.message);
      } else {
        setIsFavorite(true);
        toast.success('Liked');
        setIsLoading(false);
      }
    }
  };

  const Icon = isFavorite ? BsFillBookmarkFill : BsBookmark;

  return (
    <div className='flex flex-col'>
      <div className='bg-[#202124]'>
        <Link href={`/${url ? url : type}/${item.id}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
            className='relative group  group-hover:transition-all'
          >
            <LazyLoadImage
              className={`Image min-h-[370px] ${
                userImage && 'max-h-[370px] max-w-[250px] min-w-[250px]'
              } `}
              src={
                person && item.profile_path
                  ? `https://image.tmdb.org/t/p/original${item.profile_path}`
                  : item.poster_path
                  ? `https://image.tmdb.org/t/p/original${item.poster_path}`
                  : '/assets/placeholder.png'
              }
              alt={item.title || item.name}
              threshold={0}
              effect='opacity'
              afterLoad={handleImageLoad}
              placeholderSrc='/assets/placeholder.png'
            />

            {type !== 'person' && (
              <div
                className={`${'absolute w-full hidden  group-hover:transition-all group-hover:block h-full top-0 backdrop-blur-[4px] group-hover:bg-zinc-800/50'}  `}
              >
                <div className='flex items-center justify-center h-full'>
                  <BsFillPlayFill size={40} />
                </div>
                <div className='flex justify-end h-full items-start w-full top-0 absolute pt-3 pr-3 '>
                  <button onClick={(event) => handleSubmit(event)}>
                    <Icon size={20} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </Link>
      </div>

      <p className='line-clamp-1 max-w-[250px]'>{item.title || item.name} </p>
      {!person && item?.vote_average !== 0 && (
        <div className='flex gap-3 items-center'>
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
            value={item?.vote_average ? item?.vote_average / 2 : 0}
          />
          <p className='text-stone-500 text-sm'>{item?.vote_average}</p>
        </div>
      )}
      {person && item?.vote_average !== 0 && (
        <>
          <p className='text-stone-500 text-sm'>{item.character}</p>
        </>
      )}
    </div>
  );
};

export default Item;
