'use client';

import Header from '../components/headers/Header';
import HelmetComponent from '../components/Helmet';
import ItemsCarousel from '../components/carousel/ItemsCarousel';

import Footer from '../components/Footer/Footer';

const page = async () => {
  return (
    <div>
      <HelmetComponent title={'TV Shows'} />

      <Header urltype={'trending/tv/week?'} />

      <ItemsCarousel
        urltype={'tv/popular'}
        title='Popular TV Shows'
        type={'tv'}
        explore
      />
      <ItemsCarousel
        urltype={'/tv/top_rated'}
        title='Top Rated TV Shows'
        type={'tv'}
        explore
      />
      <ItemsCarousel
        urltype={'/tv/on_the_air'}
        title='Currently Airing TV Shows'
        type={'tv'}
        explore
      />
      <ItemsCarousel
        urltype={'/tv/airing_today'}
        title='TV Shows Airing Today'
        type={'tv'}
        explore
      />
      <Footer />
    </div>
  );
};

export default page;
