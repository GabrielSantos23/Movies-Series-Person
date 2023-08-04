'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { useParams } from 'next/navigation';
import { apiKey, apiKeyYT } from '@/envexports';
import Modal from '@/app/components/modals/Modal';
import Image from 'next/image';
import PlaceholderImage from '@/public/assets/placeholder';
import CarouselTrailer from '@/app/components/carousel/CarouselTrailer';
import svgIcon from '@/public/assets/play-button-svgrepo-com.svg';
const Trailer = () => {
  const [trailers, setTrailers] = useState<any>([]);
  const params = useParams();
  const seriesId = params?.tvid;
  const [currentVideoId, setCurrentVideoId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (videoId: any) => {
    setCurrentVideoId(videoId);
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setCurrentVideoId('');
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const fetchTrailers = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${seriesId}/videos`,
          {
            params: {
              api_key: apiKey,
            },
          }
        );

        const trailerData = response.data.results;
        const trailersWithDurations = await Promise.all(
          trailerData.map(async (trailer: any) => {
            const youtubeResponse = await axios.get(
              `https://www.googleapis.com/youtube/v3/videos?id=${trailer.key}&part=contentDetails&key=${apiKeyYT}`
            );

            const duration =
              youtubeResponse.data.items[0]?.contentDetails?.duration;
            const formattedDuration =
              moment.duration(duration).minutes() +
              ':' +
              moment.duration(duration).seconds();

            return { ...trailer, duration: formattedDuration };
          })
        );

        setTrailers(trailersWithDurations);
      } catch (error) {
        console.error('Error fetching trailers:', error);
      }
    };

    fetchTrailers();
  }, [seriesId, apiKey, apiKeyYT]);

  return (
    <>
      {trailers.length > 5 && (
        <div className='mx-10 mt-10  '>
          <h1 className='mb-5 text-xl'>Trailers</h1>
          <div className='flex'>
            <CarouselTrailer>
              {trailers.map((trailer: any) => (
                <div key={trailer.id}>
                  <div className='group relative cursor-pointer '>
                    <Image
                      width='500'
                      height='281'
                      src={`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`}
                      alt={trailer.name}
                      onError={(e: any) => {
                        e.target.src = <PlaceholderImage />;
                      }}
                      onClick={() => handleClick(trailer.key)}
                      className=' transition duration-200 group-hover:opacity-75'
                    />

                    <div>
                      <p className='absolute bottom-1 right-0 z-10 bg-black p-2 px-2 py-1 text-xs'>
                        {trailer.duration}
                      </p>
                      <div
                        onClick={() => handleClick(trailer.key)}
                        className='absolute inset-0 z-10 flex  items-center justify-center  '
                      >
                        <Image
                          src={svgIcon}
                          alt='play'
                          width={50}
                          height={50}
                        />
                      </div>
                    </div>
                  </div>
                  <p className='max-w-[400px]'>{trailer.name}</p>
                  <p className='text-sm text-stone-500 '>{trailer.type}</p>
                </div>
              ))}
            </CarouselTrailer>
          </div>
          <div>
            <Modal video isOpen={isOpen} onClose={handleCloseModal}>
              <div className='relative w-full overflow-hidden pt-[56.25%]'>
                <iframe
                  title='video player'
                  width='90%'
                  height=''
                  src={`https://www.youtube.com/embed/${currentVideoId}`}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  className='absolute top-0 h-full w-full'
                  style={{ border: 'none' }}
                />
              </div>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
};

export default Trailer;
