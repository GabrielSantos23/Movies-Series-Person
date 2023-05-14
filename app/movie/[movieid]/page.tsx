'use client';

import HeaderDetails from '@/app/components/headers/HeaderDetails';
import React from 'react';

const page = () => {
  return (
    <div>
      <HeaderDetails type={'movie'} link={`https://embed.warezcdn.com/filme`} />
    </div>
  );
};

export default page;
