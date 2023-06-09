'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import React from 'react';
import './carouselStyle.css';
import styled from 'styled-components';

SwiperCore.use([Navigation, Pagination]);

interface SwiperArrowProps {
  onClick?: () => void;
  className?: string;
  isBeginning?: boolean;
  isEnd?: boolean;
}

interface CarouselProps {
  children?: any;
}

const SwiperArrowLeft: React.FC<SwiperArrowProps> = ({
  onClick,
  className,
  isBeginning,
}) => (
  <button
    onClick={onClick}
    className={`swiper-button-prev ${className} ${
      isBeginning ? 'swiper-button-disabled' : ''
    }`}
    aria-hidden='true'
    aria-disabled={isBeginning}
    type='button'
  ></button>
);

const SwiperArrowRight: React.FC<SwiperArrowProps> = ({
  onClick,
  className,
  isEnd,
}) => (
  <button
    onClick={onClick}
    className={`swiper-button-next ${className} ${
      isEnd ? 'swiper-button-disabled' : ''
    }`}
    aria-hidden='true'
    aria-disabled={isEnd}
    type='button'
  ></button>
);

const Carousel: React.FC<CarouselProps> = ({ children }) => {
  const swiperOptions = {
    slidesPerView: 7.15,
    spaceBetween: 3,
    initialSlide: 0,
    autoplay: false,
    loop: false,
    pagination: false,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      1600: {
        slidesPerView: 7.15,
        slidesPerGroup: 4,
      },
      1300: {
        slidesPerView: 5.15,
        slidesPerGroup: 3,
      },
      1024: {
        slidesPerView: 3,
        slidesPerGroup: 3,
      },
      600: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        initialSlide: 2,
      },
      250: {
        slidesPerView: 1,
        slidesPerGroup: 1,
      },
    },
  };

  const StyledSwiper = styled(Swiper)`
    .swiper-button-prev {
      height: 370px;
      top: 0;
      left: 0;
      background-color: #00000090;
      border: none;
      color: white;
      font-size: 10px;
      width: 30px;
    }
    .swiper-button-next {
      height: 370px;
      top: 0;
      right: 0;
      background-color: #00000090;
      border: none;
      color: white;
      font-size: 10px;
      width: 30px;
    }
  `;

  return (
    <StyledSwiper {...swiperOptions}>
      {React.Children.map(children, (child) => (
        <SwiperSlide key={child.key} className='card-home'>
          {child}
        </SwiperSlide>
      ))}
      <SwiperArrowLeft />
      <SwiperArrowRight />
    </StyledSwiper>
  );
};

export default Carousel;
