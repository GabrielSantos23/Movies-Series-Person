import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdRefresh } from 'react-icons/md';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Modal from '../modals/Modal';
// import 'react-lazy-load-image-component/src/effects/blur.css';

interface ActorPhotosProps {
  id: string;
}

const ActorPhotos: React.FC<ActorPhotosProps> = ({ id }) => {
  const [Poster, setPoster] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  useEffect(() => {
    const getMoviePhotos = async () => {
      const response = await axios.get(
        `
        https://api.themoviedb.org/3/person/${id}/images?api_key=${apiKey}`
      );

      const postersEn = response.data.profiles;

      setPoster(postersEn);
    };

    getMoviePhotos();
  }, [id]);

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
  }, [Poster]);

  return (
    <div className='my-10'>
      <div className='flex items-center gap-2 my-3'>
        <h2 className='font-normal text-xl'>Images</h2>
        <p className='text-stone-500 text-sm'>{Poster.length} Images</p>
      </div>

      <div className='flex flex-wrap gap-3 items-center'>
        {Poster.map((poster: any, index: any) => (
          <div key={index} className='bg-[#202124]'>
            <LazyLoadImage
              key={poster.file_path}
              className='w-[220px] h-[350px]'
              src={`https://image.tmdb.org/t/p/w500${poster.file_path}`}
              alt={poster.file_path}
              effect='opacity'
              onClick={() => {
                setSelectedImage(poster.file_path);
                setModalIsOpen(true);
              }}
            />
          </div>
        ))}
      </div>

      <Modal isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)}>
        {isLoading ? (
          <div className='flex justify-center items-center'>
            <MdRefresh size={50} color='white' />
          </div>
        ) : (
          selectedImage && (
            <LazyLoadImage
              src={`https://image.tmdb.org/t/p/original/${selectedImage}`}
              alt='selectedImage'
              className='max-h-[90%]'
              onError={() => setIsLoading(false)}
            />
          )
        )}
      </Modal>
    </div>
  );
};

export default ActorPhotos;
