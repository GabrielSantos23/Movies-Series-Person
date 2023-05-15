'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdRefresh } from 'react-icons/md';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import './PhotosStyles.css';
import Modal from '../modals/Modal';
// import 'react-lazy-load-image-component/src/effects/blur.css';

interface PhotosProps {
  id: string;
  type: any;
}

const Photos: React.FC<PhotosProps> = ({ type, id }) => {
  const [Poster, setPoster] = useState<any>([]);
  const [Backdrop, setBackdrop] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const getMoviePhotos = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/${type}/${id}/images?api_key=${apiKey}`
      );

      const postersEn = response.data.posters.filter((poster: any) => {
        return poster.iso_639_1 === 'en';
      });

      setPoster(postersEn);

      const backdropsEn = response.data.backdrops.filter((backdrop: any) => {
        return backdrop.iso_639_1 === 'en';
      });

      setBackdrop(backdropsEn);
    };

    getMoviePhotos();
  }, [id]);

  useEffect(() => {
    document.body.style.overflow = modalIsOpen ? 'hidden' : 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [modalIsOpen]);

  return (
    <div>
      {/* Backdrop */}

      <div className='flex items-center gap-3'>
        <h2 className='font-normal text-xl'>Backdrops</h2>
        <p className='text-stone-500 text-sm'>{Backdrop.length} Images</p>
      </div>

      <div className='flex flex-wrap gap-3 items-center'>
        {Backdrop.map((poster: any, index: any) => (
          <div key={index} className='bg-[#202124]'>
            <LazyLoadImage
              key={poster.file_path}
              src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
              alt={poster.file_path}
              effect='opacity'
              onClick={() => {
                setSelectedImage(poster.file_path);
                setModalIsOpen(true);
              }}
              className='PhotoStyle'
            />
          </div>
        ))}
      </div>

      {/* Posters  */}
      <div className='flex items-center gap-3 mt-5'>
        <h2 className='font-normal text-xl'>Posters</h2>
        <p className='text-stone-500 text-sm'>{Poster.length} Images</p>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        {Poster.map((poster: any, index: any) => (
          <div
            key={index}
            style={{
              backgroundColor: '#202124',
            }}
          >
            <LazyLoadImage
              key={poster.file_path}
              src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
              alt={poster.file_path}
              effect='opacity'
              onClick={() => {
                setSelectedImage(poster.file_path);
                setModalIsOpen(true);
              }}
              className='PhotoStyle'
            />
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalIsOpen}
        onClose={() => {
          setModalIsOpen(false);
        }}
      >
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <MdRefresh size={50} color='white' />
          </div>
        ) : (
          selectedImage && (
            <LazyLoadImage
              src={`https://image.tmdb.org/t/p/original/${selectedImage}`}
              alt='selectedImage'
              onError={() => setIsLoading(false)}
              effect='opacity'
              className='PhotoStyleOpen lg:w-[500px]'
            />
          )
        )}
      </Modal>
    </div>
  );
};

export default Photos;
