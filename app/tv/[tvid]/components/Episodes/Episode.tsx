import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { apiKey } from '@/envexports';
import { useUser } from '@/hooks/useUser';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import ItemsCarousel from '@/app/components/carousel/ItemsCarousel';
import WarezIframe from '@/app/components/WarezIframe';

const Episode = () => {
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const params = useParams();
  const id = params?.tvid;

  const [seriesDetails, setSeriesDetails] = useState<any | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);

  useEffect(() => {
    if (user?.id && id) {
      const fetchData = async () => {
        try {
          const { data, error } = await supabaseClient
            .from('user_episodes')
            .select('season, episode')
            .eq('user_id', user.id)
            .eq('series_id', id)
            .single();

          if (!error && data) {
            setSelectedSeason(data.season);
            setSelectedEpisode(data.episode);
          }
        } catch (error) {
          console.error('Error fetching saved episode and season:', error);
        }
      };
      fetchData();
    }

    if (id) {
      axios
        .get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&language=en-US`
        )
        .then((response) => {
          setSeriesDetails(response.data);
        })
        .catch((error) => {
          console.error('Error fetching series details:', error);
        });
    }
  }, [id, supabaseClient, user?.id]);

  useEffect(() => {
    if (user?.id && id && (selectedSeason !== 1 || selectedEpisode !== 1)) {
      const checkExistingRecords = async () => {
        try {
          const { data } = await supabaseClient
            .from('user_episodes')
            .select()
            .eq('user_id', user.id)
            .eq('series_id', id);

          const episodeData = {
            user_id: user.id,
            series_id: id,
            season: selectedSeason,
            episode: selectedEpisode,
          };

          if (data && data.length > 0) {
            const recordId = data[0].id;
            await supabaseClient
              .from('user_episodes')
              .delete()
              .eq('id', recordId);
          }

          await insertEpisodeData(episodeData);
        } catch (error) {
          handleError('Error checking existing records:', error);
        }
      };

      checkExistingRecords();
    }

    function insertEpisodeData(data: any) {
      supabaseClient
        .from('user_episodes')
        .insert([data])
        .then(() => {
          toast.success(
            'Episodes ' +
              (data.season === 1 && data.episode === 1 ? 'saved' : 'updated') +
              ' successfully'
          );
        });
    }

    function handleError(message: string, error: any) {
      console.error(message, error);
      toast.error(error.message);
    }
  }, [user?.id, id, selectedSeason, selectedEpisode, supabaseClient]);

  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const season = parseInt(event.target.value);
    setSelectedSeason(season);
    setSelectedEpisode(1);
  };

  const handleEpisodeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const episode = parseInt(event.target.value);
    setSelectedEpisode(episode);
  };

  const optionStyle = 'rounded-none bg-[#141414] text-base';
  const selectStyle = 'bg-transparent text-xl';

  return (
    <div className='mb-10 mt-20 px-10 '>
      {seriesDetails && (
        <div>
          <div className='mb-5 flex gap-5'>
            <select
              className={selectStyle}
              value={selectedSeason}
              onChange={handleSeasonChange}
            >
              {Array.from(
                { length: seriesDetails.number_of_seasons },
                (_, index) => index + 1
              ).map((season) => (
                <option key={season} value={season} className={optionStyle}>
                  Season {season}
                </option>
              ))}
            </select>

            <select
              className={selectStyle}
              value={selectedEpisode}
              onChange={handleEpisodeChange}
            >
              {Array.from(
                {
                  length:
                    seriesDetails.seasons[selectedSeason - 1]?.episode_count ||
                    1,
                },
                (_, index) => index + 1
              ).map((episode) => (
                <option className={optionStyle} key={episode} value={episode}>
                  Episode {episode}
                </option>
              ))}
            </select>
          </div>

          <div id='tv'>
            <WarezIframe
              type='serie'
              imdb={id}
              season={selectedSeason.toString()}
              episode={selectedEpisode.toString()}
            />
          </div>
        </div>
      )}
      <ItemsCarousel
        urltype={`tv/${id}/credits?api_key=${apiKey}`}
        title='Cast'
        type={'person'}
        url='person'
        details
      />
      <ItemsCarousel
        urltype={`tv/${id}/recommendations?api_key=${apiKey}`}
        title='More Like This'
        type={'similar'}
        url='tv'
        serie={seriesDetails}
        explore
        details
      />
    </div>
  );
};

export default Episode;
