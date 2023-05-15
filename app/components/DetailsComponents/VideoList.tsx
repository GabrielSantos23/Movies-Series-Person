'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import PlaceholderImage from '../../../public/assets/placeholder';

import moment from 'moment';
import svgIcon from '../../../public/assets/play-button-svgrepo-com.svg';
import Image from 'next/image';
import Modal from '../modals/Modal';

const Time: React.FC<{ videoId: string; duration: string }> = ({
  videoId,
  duration,
}) => {
  return (
    <p
      style={{
        position: 'absolute',
        bottom: '5px',
        right: '10px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '5px',
        borderRadius: '5px',
        fontSize: '12px',
        width: '20px',
      }}
    >
      {duration}
    </p>
  );
};

const PlayIcon: React.FC = () => {
  return (
    <Image
      style={{
        position: 'absolute',
        bottom: 'px',
        right: '0px',
        top: '40%',
        left: '45%',
        color: 'white',
        padding: '5px',
        borderRadius: '5px',
        fontSize: '12px',
        width: '40px',
      }}
      src={svgIcon}
      alt='Play Button'
    />
  );
};

interface Video {
  type: string;
}

interface Option {
  value: string;
  label: string;
}

interface VideoListProps {
  id: string;
  type: any;
}

const VideoList: React.FC<VideoListProps> = ({ id, type }) => {
  const [videos, setVideos] = useState<any>([]);

  const [currentVideoId, setCurrentVideoId] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
  const [selectedTypeCount, setSelectedTypeCount] = useState(0);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const [isOpen, setIsOpen] = useState(false);

  console.log(videos);
  const [videoDetails, setVideoDetails] = useState<Record<string, string>>({});
  const url = `https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apiKey}`;

  const apiKeyYT = process.env.NEXT_PUBLIC_APIKEY_YT;

  useEffect(() => {
    axios
      .get(url)
      .then((response) => {
        const videos: Video[] = response.data.results;
        setVideos(videos);

        // percorre a lista de vídeos e conta quantos vídeos existem em cada categoria
        const categoryCounts: { [key: string]: number } = videos.reduce(
          (acc: any, video) => {
            acc[video.type] = (acc[video.type] || 0) + 1;
            return acc;
          },
          {}
        );

        // cria uma lista de objetos de opção de categoria para cada categoria com pelo menos um vídeo
        const options: Option[] = Object.entries(categoryCounts)
          .filter(([category, count]) => count > 0)
          .map(([category, count]) => ({ value: category, label: category }));

        setCategoryOptions(options);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [url]);

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

  const handleTypeChange = (event: any) => {
    setSelectedType(event.target.value);
  }; // novo handler para atualizar o tipo selecionado

  const filteredVideos =
    selectedType === 'all'
      ? videos
      : videos.filter((video: any) => video.type === selectedType); // filtro dos vídeos de acordo com o tipo selecionado

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      border: 'none',
      zIndex: '9999',

      top: '0',
      left: '0',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      backgroundColor: 'black',
      border: 'none',
      width: '90%',
      height: '90%',
      margin: 'auto',
      overflow: 'hidden',
      maxWidth: '1900px',
      maxHeight: '1000px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
  useEffect(() => {
    // atualiza o número de vídeos na categoria selecionada sempre que o tipo selecionado for alterado
    setSelectedTypeCount(filteredVideos.length);
  }, [filteredVideos.length, selectedType]);

  useEffect(() => {
    // Recupera os detalhes de todos os vídeos na lista de vídeos
    filteredVideos.forEach((video: any) => {
      axios
        .get(
          `https://www.googleapis.com/youtube/v3/videos?id=${video.key}&part=contentDetails&key=${apiKeyYT}`
        )
        .then((response) => {
          const duration = response.data.items[0].contentDetails.duration;
          const formattedDuration =
            moment.duration(duration).minutes() +
            ':' +
            moment.duration(duration).seconds();
          setVideoDetails((prevState) => {
            return {
              ...prevState,
              [video.key]: formattedDuration,
            };
          });
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, [filteredVideos]);

  return (
    <div className='flex flex-col  mb-5 '>
      <div className='flex gap-3 mb-5 w-full'>
        <select
          className='bg-[#202124] border-none rounded-sm text-sm min-w-[150px] focus:outline-none py-3'
          id='type-filter'
          value={selectedType}
          onChange={handleTypeChange}
        >
          <option value='all'>All</option>
          {categoryOptions.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className='flex flex-wrap gap-1 justify-items-center'>
        {filteredVideos.map((video: any, index: any) => (
          <div key={index} className='flex flex-col'>
            <div className='relative cursor-pointer hover:opacity-80 transition'>
              <LazyLoadImage
                src={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                alt={video.name}
                onClick={() => handleClick(video.key)}
                effect='opacity'
                onError={(e: any) => {
                  e.target.src = <PlaceholderImage />;
                }}
                className='w-[400px] bg-[#202124]'
              />
              <PlayIcon />
              <Time videoId={video.key} duration={videoDetails[video.key]} />
            </div>
            <p className='max-w-[400px]'>{video.name}</p>
            <p className='text-stone-500 text-sm '>{video.type}</p>
          </div>
        ))}
      </div>
      <Modal video isOpen={isOpen} onClose={handleCloseModal}>
        <div className='relative overflow-hidden w-full pt-[56.25%]'>
          <iframe
            title='video player'
            width='90%'
            height=''
            src={`https://www.youtube.com/embed/${currentVideoId}`}
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            className='absolute top-0 w-full h-full'
            style={{ border: 'none' }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default VideoList;
