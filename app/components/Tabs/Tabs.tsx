'use client';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './TabsStyle.css';
import Overview from '../DetailsComponents/Overview';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface TabsComponentProps {
  serie?: boolean;
  type?: string;
}

const TabStyle =
  'text-sm sm:text-lg tracking-[1px] pt-[10px] pb-[10px] font-medium text-stone-500 transition hover:text-gray-200 outline-none cursor-pointer  ';
const TabPanelStyle = 'pl-10';
const TabsComponent: React.FC<TabsComponentProps> = ({ serie, type }) => {
  const params = useParams();
  const objectid = params;
  const id = objectid.movieid || objectid.tvid;

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const [movie, setMovie] = useState<any>(null);
  const [director, setDirector] = useState([]);
  const [genres, setGenres] = useState([]);
  const [ProductionCompanies, setProductionCompanies] = useState([]);
  const [SocialMedia, setSocialMedia] = useState([]);
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    if (id && apiKey && type) {
      if (type === 'movie' || type === 'tv') {
        axios
          .get(
            `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&language=en-US`
          )
          .then((response) => {
            const results = response.data;
            setMovie(results);
            setSeasons(results.seasons);
            const movieId = results.id;
            axios
              .get(
                `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits`
              )
              .then((response) => {
                const credits = response.data.credits;
                const director = credits.crew.find(
                  (person: any) => person.job === 'Director'
                );
                const genres = results.genres.map((genre: any) => genre.name);
                setDirector(director?.name);
                if (
                  credits.crew.filter(
                    (person: any) => person.job === 'Director'
                  ).length > 1
                ) {
                  setDirector(
                    credits.crew
                      .filter((person: any) => person.job === 'Director')
                      .map((person: any) => person.name)
                      .join(', ')
                  );
                } else {
                  setDirector(director?.name);
                }

                setGenres(genres.join(', '));
              });
          });
        axios
          .get(
            `https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=credits,production_companies,external_ids`
          )
          .then((response) => {
            const credits = response.data.credits;
            const productionCompanies = response.data.production_companies;
            const socialMedia = response.data.external_ids;

            const companies = productionCompanies.map(
              (company: any) => company.name
            );
            setProductionCompanies(companies.join(', '));

            setSocialMedia(socialMedia);
          });
      }
    }
  }, []);
  if (!movie) return null;

  return (
    <div className=' mt-5 '>
      <Tabs className='flex flex-col '>
        <TabList className='flex justify-center gap-12'>
          <Tab className={TabStyle}>OVERVIEW</Tab>
          {serie && <Tab className={TabStyle}>EPISODES</Tab>}
          <Tab className={TabStyle}>VIDEOS</Tab>
          <Tab className={TabStyle}>PHOTOS</Tab>
        </TabList>
        <TabPanel className={TabPanelStyle}>
          <Overview
            item={movie}
            director={director}
            genres={genres}
            ProductionCompanies={ProductionCompanies}
            SocialMedia={SocialMedia}
            id={id}
            seasons={seasons}
            type={type}
            serie={serie}
          />
        </TabPanel>
        {serie && <TabPanel className={TabPanelStyle}>EPISODES</TabPanel>}
        <TabPanel className={TabPanelStyle}>VIDEOS</TabPanel>
        <TabPanel className={TabPanelStyle}>PHOTS</TabPanel>
      </Tabs>
    </div>
  );
};

export default TabsComponent;
