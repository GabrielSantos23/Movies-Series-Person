'use client';

import Header from '../components/headers/Header';
import HelmetComponent from '../components/Helmet';
import ItemsCarousel from '../components/carousel/ItemsCarousel';
import Footer from '../components/Footer/Footer';

const page = () => {
  return (
    <div>
      <HelmetComponent title={'Movies'} />

      <Header urltype={'trending/movie/week?'} />

      <ItemsCarousel
        urltype={'movie/popular'}
        title='Popular Movies'
        type={'movie'}
        explore
      />
      <ItemsCarousel
        urltype={'/movie/top_rated'}
        title='Top Rated Movies'
        type={'movie'}
        explore
      />
      <ItemsCarousel
        urltype={'/movie/upcoming'}
        title='Upcoming Movies'
        type={'movie'}
        explore
      />
      <ItemsCarousel
        urltype={'/movie/now_playing'}
        title='Now Playing Movies'
        type={'movie'}
        explore
      />
      <Footer />
    </div>
  );
};

export default page;
