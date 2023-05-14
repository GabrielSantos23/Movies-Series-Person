import Image from 'next/image';
import Header from '../components/headers/Header';
import HelmetComponent from '../components/Helmet';
import ItemsCarousel from '../components/carousel/ItemsCarousel';

export default function Home() {
  return (
    <div>
      <HelmetComponent />
      <Header urltype={'trending/all/week?'} />
      <ItemsCarousel
        urltype={'trending/movie/week'}
        title='Trending Movies'
        type={'movie'}
        explore
      />
      <ItemsCarousel
        urltype={'trending/tv/week'}
        title='Trending Series'
        type={'serie'}
        explore
      />
    </div>
  );
}
