'use client';

import Footer from '@/app/components/Footer/Footer';
import Tabs from '@/app/components/Tabs/Tabs';
import HeaderDetails from '@/app/components/headers/HeaderDetails';
import React from 'react';
import Movie from './components/movie';

const page = () => {
  return (
    <div>
      <HeaderDetails type={'movie'} link={`https://embed.warezcdn.com/filme`} />
      <Movie />
      <Footer />
    </div>
  );
};

export default page;
