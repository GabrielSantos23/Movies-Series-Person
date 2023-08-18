'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { apiKey } from '@/envexports';
import { useUser } from '@/hooks/useUser';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import ItemsCarousel from '@/app/components/carousel/ItemsCarousel';
import WarezIframe from '@/app/components/WarezIframe';

const Movie = () => {
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const params = useParams();
  const id = params.movieid;

  console.log(id);

  const [movie, setMovie] = useState<any | null>(null);
  const [SocialMedia, setSocialMedia] = useState<any>([]);

  useEffect(() => {
    if (id) {
      axios
        .get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=en-US`
        )
        .then((response) => {
          setMovie(response.data);
        })
        .catch((error) => {
          console.error('Error fetching series details:', error);
        });
    }
    axios
      .get(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,production_companies,external_ids`
      )
      .then((response) => {
        const socialMedia = response.data.external_ids;

        setSocialMedia(socialMedia);
      });
  }, [id, supabaseClient, user?.id]);

  const imdbid = movie?.imdb_id ? movie?.imdb_id : SocialMedia?.imdb_id;

  return (
    <div className='mb-10 mt-20 px-10 '>
      {movie && (
        <section id='movie'>
          <div>
            {/* <iframe
              src={`https://embed.warezcdn.com/filme/${imdbid}`}
              className='h-[900px]  w-full  xl:h-[700px] '
              allowFullScreen
              loading='lazy'
              allow='picture-in-picture'
            /> */}
            <WarezIframe type='filme' imdb={imdbid} />
          </div>
        </section>
      )}
      <ItemsCarousel
        urltype={`movie/${id}/credits?api_key=${apiKey}`}
        title='Cast'
        type={'person'}
        url='person'
        details
      />
      <ItemsCarousel
        urltype={`movie/${id}/recommendations?api_key=${apiKey}`}
        title='More Like This'
        type={'similar'}
        url='movie'
        explore
        details
      />
    </div>
  );
};

export default Movie;
