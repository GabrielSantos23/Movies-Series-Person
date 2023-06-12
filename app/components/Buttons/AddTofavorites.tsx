'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import TopBarProgress from 'react-topbar-progress-indicator';

import useAuthModal from '@/hooks/useAuthModal';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import { toast } from 'react-hot-toast';

interface AddToFavoriteButtonProps {
  id: string | string[] | null;
  type: string;
}

function AddToFavoriteButton({ id, type }: AddToFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const authModal = useAuthModal();
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();

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
        .eq(TypeId, id)
        .single();

      if (!error && data) {
        setIsFavorite(true);
      }
    };
    fetchData();
  }, [id, supabaseClient, user?.id]);

  const Icon = isFavorite ? BsFillBookmarkFill : BsBookmark;

  const handleSubmit = async () => {
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
        .eq(TypeId, id);
      if (error) {
        toast.error(error.message);
        setIsLoading(false);
      } else {
        setIsFavorite(false);
        setIsLoading(false);
      }
    } else {
      const { error } = await supabaseClient.from(Ttype).insert({
        [TypeId]: id,
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

    router.refresh();
  };

  TopBarProgress.config({
    barColors: {
      0: '#2196F3',
      '1.0': '#2196F3',
    },
  });

  const router = useRouter();

  // const types = type === 'movie' ? 'isfavorite' : 'isFavoriteTvShow';
  // const typename = type === 'movie' ? 'movieId' : 'tvShowId';
  // useEffect(() => {
  //   const checkIsFavorite = async () => {
  //     if (status === 'authenticated') {
  //       try {
  //         const res = await axios.get(`/api/${types}?${typename}=${id}`);

  //         setIsFavorite(res.data);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   };

  //   checkIsFavorite();
  // }, [id, status, types]);

  // async function handleFavorite() {
  //   const data = type === 'movie' ? { movieId: id } : { tvShowId: id };
  //   const typeS = type === 'movie' ? 'movies' : 'tvshows';

  //   setIsLoading(true);

  //   if (status !== 'authenticated') {
  //     const shouldLogIn = window.confirm(
  //       'Você precisa estar logado para salvar nos favoritos. Deseja fazer login ou se registrar agora?'
  //     );
  //     if (shouldLogIn) {
  //       router.push('/profile');
  //       return;
  //     } else {
  //       setIsLoading(false);
  //     }
  //   }

  //   try {
  //     const res = await axios.post(`/api/${typeS}`, data);
  //     if (typeof res.data === 'object') {
  //       setIsFavorite((prevIsFavorite) => !prevIsFavorite);
  //       setIsLoading(false);
  //     } else {
  //       setIsLoading(false);
  //       throw new Error('Resposta inválida');
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  const ButtonStyle =
    'py-2 px-4 bg-[#202124] rounded-sm  hover:bg-[#18191C] transition text-white flex items-center cursor-pointer text-lg ';

  return (
    <>
      {isLoading && <TopBarProgress />}

      {/* {isFavorite ? (
        <button className={ButtonStyle} onClick={handleFavorite}>
          <BsFillBookmarkFill />
        </button>
      ) : (
        <button className={ButtonStyle} onClick={handleFavorite}>
          <BsBookmark />
        </button>
      )} */}

      <button onClick={handleSubmit} className={ButtonStyle}>
        <Icon />
      </button>
    </>
  );
}

export default AddToFavoriteButton;
