'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Placeholder from '../../../public/assets/placeholder';
import { format } from 'date-fns';
import Placeholder16 from '../../../public/assets/placeholder16';

import Modal from '../modals/Modal';

interface EpisodeListProps {
  id: string | string[] | null;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ id }) => {
  const [episodes, setEpisodes] = useState<any>([]);
  const [numSeasons, setNumSeasons] = useState(0);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

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
      {showModal && (
        <Modal video onClose={() => setShowModal(false)} isOpen={showModal}>
          <div className='relative overflow-hidden w-full pt-[56.25%]'>
            <iframe
              src={`https://embed.warezcdn.com/serie/${id}/${selectedSeason}/${selectedEpisode}`}
              className='absolute top-0 w-full h-full'
              allowFullScreen
              allow='picture-in-picture'
            />
          </div>
        </Modal>
      )}
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
              className='min-h-[220px]  '
            >
              <LazyLoadImage
                className=' bg-[#202124] cursor-pointer md:w-[400px] w-[300px] object-cover h-[250px] '
                src={
                  episode.still_path
                    ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                    : '/assets/placeholderLG.png'
                }
                alt={episode.name}
                threshold={0}
                effect='opacity'
                afterLoad={handleImageLoad}
              />
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <p style={{ color: '#1d9bf0', fontWeight: '500' }}>
                E{episode.episode_number.toString().padStart(2, '0')}
              </p>
              <p className='lg:max-w-[380px] max-w-[300px] font-normal'>
                {episode.name}
              </p>
            </div>
            <div>
              <div className='line-clamp-2 text-stone-500 text-xs lg:w-[350px] w-[300px]'>
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

export default EpisodeList;
