'use client';

import Footer from '@/app/components/Footer/Footer';
import Tabs from '@/app/components/Tabs/Tabs';
import HeaderDetails from '@/app/components/headers/HeaderDetails';
import React from 'react';

const page = () => {
  return (
    <div>
      <HeaderDetails type={'movie'} link={`https://embed.warezcdn.com/filme`} />
      <Tabs type={'movie'} />
      <Footer />
    </div>
  );
};

export default page;
