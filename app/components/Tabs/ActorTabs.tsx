'use client';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './TabsStyle.css';
import Overview from '../DetailsComponents/Overview';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ActorKnowFor from '../ActorsComponents/KnowFor';
import ActorCredits from '../ActorsComponents/Credits';
import ActorPhotos from '../ActorsComponents/Photos';

const TabStyle =
  'text-sm sm:text-lg tracking-[1px] pt-[10px] pb-[10px] font-medium text-stone-500 transition hover:text-gray-200 outline-none cursor-pointer  ';
const TabPanelStyle = '';
const ActorTabs = ({}) => {
  const params = useParams();
  const objectid = params;
  const id = objectid && objectid.personid;
  return (
    <div className=' mt-5 mb-10'>
      <Tabs className='flex flex-col '>
        <TabList className='flex justify-center gap-12'>
          <Tab className={TabStyle}>KNOW FOR</Tab>
          <Tab className={TabStyle}>CREDITS</Tab>
          <Tab className={TabStyle}>PHOTOS</Tab>
        </TabList>
        <TabPanel className={TabPanelStyle}>
          <ActorKnowFor id={id} />
        </TabPanel>
        <TabPanel className={TabPanelStyle}>
          <ActorCredits id={id} />
        </TabPanel>
        <TabPanel className={TabPanelStyle}>
          <ActorPhotos id={id} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default ActorTabs;
