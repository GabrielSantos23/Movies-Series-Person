'use client';

import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

interface HelmetcomponentProps {
  title?: string;
}

const HelmetComponent: React.FC<HelmetcomponentProps> = ({ title }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title ? title : 'Browse Movies, TV Shows and People'}</title>
      </Helmet>
    </HelmetProvider>
  );
};

export default HelmetComponent;
