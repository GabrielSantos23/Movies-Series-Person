'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Placeholder from '../../../public/assets/placeholder';
import { format } from 'date-fns';
// import Modal from './ModalSerie';
import Placeholder16 from '../../../public/assets/placeholder16.jsx';

interface EpisodeListProps {
  id: string;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ id }) => {
  const [episodes, setEpisodes] = useState<any>([]);
  const [numSeasons, setNumSeasons] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const handleEpisodeClick = (episode: any) => {
    setSelectedEpisode(episode);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEpisode(null);
  };

  useEffect(() => {
    const fetchEpisodes = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${apiKey}`
      );
      setEpisodes(response.data.episodes);
    };
    fetchEpisodes();
  }, [selectedSeason]);

  useEffect(() => {
    const fetchNumSeasons = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`
      );
      setNumSeasons(response.data.number_of_seasons);
    };
    fetchNumSeasons();
  }, []);

  const handleIntersection = (entries: any) => {
    entries.forEach((entry: any) => {
      if (entry.isIntersecting) {
        const image = entry.target;
        const src = image.getAttribute('data-src');

        if (src) {
          setTimeout(() => {
            image.setAttribute('src', src);
            image.classList.add('fade-in');
          }, 200);
        }

        observer.unobserve(image);
      }
    });
  };

  const observer = new IntersectionObserver(handleIntersection, {
    rootMargin: '0px',
    threshold: 0.1,
  });

  useEffect(() => {
    const images = document.querySelectorAll('[data-src]');
    images.forEach((image) => {
      observer.observe(image);
    });
  }, [episodes]);

  const seasons = Array.from({ length: numSeasons }, (_, i) => i + 1);

  return (
    <div>
      {
        showModal && ''
        // <Modal
        //   link={`https://embed.warezcdn.com/serie/${id}/${selectedSeason}/${selectedEpisode}`}
        //   onClose={handleCloseModal}
        // />
      }
      <div className='flex items-center gap-3 '>
        <select
          className='bg-[#202124] border-none rounded-sm p-3  text-sm min-w-[150px] focus:outline-none'
          value={selectedSeason}
          onChange={(event: any) => setSelectedSeason(event.target.value)}
        >
          {seasons.map((season) => (
            <option key={season} value={season}>
              Season {season}
            </option>
          ))}
        </select>
        <p className='text-stone-500'>{episodes.length} Episodes</p>
      </div>
      <div className='flex flex-wrap gap-3 mt-3'>
        {episodes.map((episode: any, index: any) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '20px',
            }}
          >
            <div
              onClick={() => handleEpisodeClick(episode.episode_number)}
              style={{
                backgroundColor: '#202124',

                maxWidth: '400px',
              }}
            >
              {episode.still_path ? (
                <LazyLoadImage
                  style={{
                    backgroundColor: '#202124',
                    width: '100%',
                    height: '100%',
                  }}
                  src={`https://image.tmdb.org/t/p/w500${episode.still_path}`}
                  alt={episode.name}
                  threshold={0}
                  effect='opacity'
                />
              ) : (
                <Placeholder16 width={'400px'} />
              )}
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ color: '#1d9bf0', fontWeight: '500' }}>
                E{episode.episode_number.toString().padStart(2, '0')}
              </p>
              <p style={{ maxWidth: '380px', fontWeight: '400' }}>
                {episode.name}
              </p>
            </div>
            <div>
              <div className='line-clamp-2 text-stone-500 text-xs max-w-[350px]'>
                {episode.overview}
              </div>
            </div>
            <div>
              <div
                style={{ color: 'gray', fontSize: '14px', marginTop: '10px' }}
              >
                {format(new Date(episode.air_date), 'dd MMMM yyyy')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// const Image = styled(LazyLoadImage)`
//   border: 0;
//   outline: none;
//   width: 100%;
//   height: 380px;
//   background-color: #202124;
//   border-style: none;
//   cursor: pointer;
//   &[src=''] {
//     visibility: hidden;
//   }

//   &[src] {
//     visibility: visible;
//     opacity: 0;
//     animation: fadeIn 500ms ease-in-out forwards;
//   }

//   &:hover {
//     opacity: 0.8;
//   }

//   @keyframes fadeIn {
//     from {
//       opacity: 0;
//     }
//     to {
//       opacity: 1;
//     }
//   }
// `;

// const Overview = styled.p`
//   display: -webkit-box;
//   -webkit-line-clamp: 4;
//   -webkit-box-orient: vertical;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   max-width: 400px;
//   font-size: 12px;
// `;

export default EpisodeList;
