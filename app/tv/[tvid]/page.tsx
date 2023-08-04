'use client';

import Footer from '@/app/components/Footer/Footer';
import TabsComponent from '@/app/components/Tabs/Tabs';
import HeaderDetails from '@/app/components/headers/HeaderDetails';
import Header from './components/Header/Header';
import Episode from './components/Episodes/Episode';
import Trailer from './components/Trailers/Trailer';

const page = () => {
  return (
    <div>
      <HeaderDetails type={'tv'} link={`https://embed.warezcdn.com/serie`} />
      <Trailer />
      {/*  <TabsComponent type={'tv'} serie />
       */}
      <Episode />
      <Footer />
    </div>
  );
};

export default page;
