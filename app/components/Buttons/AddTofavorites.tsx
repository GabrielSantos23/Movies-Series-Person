import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BsFillBookmarkFill, BsBookmark } from 'react-icons/bs';
import TopBarProgress from 'react-topbar-progress-indicator';
import { signIn, useSession, getSession } from 'next-auth/react';

interface AddToFavoriteButtonProps {
  id: number;
  type: 'movie' | 'tvshow';
}

function AddToFavoriteButton({ id, type }: AddToFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();

  TopBarProgress.config({
    barColors: {
      0: '#2196F3',
      '1.0': '#2196F3',
    },
  });

  const router = useRouter();
  const types = type === 'movie' ? 'isfavorite' : 'isFavoriteTvShow';
  const typename = type === 'movie' ? 'movieId' : 'tvShowId';
  useEffect(() => {
    const checkIsFavorite = async () => {
      if (status === 'authenticated') {
        try {
          const res = await axios.get(`/api/${types}?${typename}=${id}`);

          setIsFavorite(res.data);
        } catch (error) {
          console.error(error);
        }
      }
    };

    checkIsFavorite();
  }, [id, status, types]);

  async function handleFavorite() {
    const data = type === 'movie' ? { movieId: id } : { tvShowId: id };
    const typeS = type === 'movie' ? 'movies' : 'tvshows';

    setIsLoading(true);

    if (status !== 'authenticated') {
      const shouldLogIn = window.confirm(
        'Você precisa estar logado para salvar nos favoritos. Deseja fazer login ou se registrar agora?'
      );
      if (shouldLogIn) {
        router.push('/profile');
        return;
      } else {
        setIsLoading(false);
      }
    }

    try {
      const res = await axios.post(`/api/${typeS}`, data);
      if (typeof res.data === 'object') {
        setIsFavorite((prevIsFavorite) => !prevIsFavorite);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        throw new Error('Resposta inválida');
      }
    } catch (err) {
      console.error(err);
    }
  }

  const ButtonStyle =
    'py-2 px-4 bg-[#202124] rounded-sm  hover:bg-[#18191C] transition text-white flex items-center cursor-pointer text-lg ';

  return (
    <>
      {isLoading && <TopBarProgress />}

      {isFavorite ? (
        <button className={ButtonStyle} onClick={handleFavorite}>
          <BsFillBookmarkFill />
        </button>
      ) : (
        <button className={ButtonStyle} onClick={handleFavorite}>
          <BsBookmark />
        </button>
      )}
    </>
  );
}

export default AddToFavoriteButton;
