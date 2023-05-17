'use client';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './TabsStyle.css';
import FavoriteMovies from '../FavoriteItems/FavoriteMovies';
import FavoriteTvShows from '../FavoriteItems/FavoriteTvShows';

const TabStyle =
  'text-sm sm:text-lg tracking-[1px] pt-[10px] pb-[10px] font-medium text-stone-500 transition hover:text-gray-200 outline-none cursor-pointer  ';
const TabPanelStyle = 'lg:pl-10 p-5';

const ProfileTabs = ({}) => {
  return (
    <div className=' mt-5 '>
      <Tabs className='flex flex-col '>
        <TabList className='flex justify-center items-center lg:gap-12 gap-2'>
          <Tab className={TabStyle}>FAVORITES MOVIES</Tab>
          <Tab className={TabStyle}>FAVORITES SERIES</Tab>
        </TabList>
        <TabPanel className={TabPanelStyle}>
          <FavoriteMovies />
        </TabPanel>
        <TabPanel className={TabPanelStyle}>
          <FavoriteTvShows />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ProfileTabs;
