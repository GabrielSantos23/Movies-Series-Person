'use client';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import './TabsStyle.css';
import Overview from '../DetailsComponents/Overview';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import EpisodeList from '../DetailsComponents/Episodes';
import VideoList from '../DetailsComponents/VideoList';
import Photos from '../DetailsComponents/Photos';

interface TabsComponentProps {
  serie?: boolean;
  type?: string;
}

const TabStyle =
  'text-sm sm:text-lg tracking-[1px] pt-[10px] pb-[10px] font-medium text-stone-500 transition hover:text-gray-200 outline-none cursor-pointer  ';
const TabPanelStyle = 'lg:pl-10 p-5';
const TabsComponent: React.FC<TabsComponentProps> = ({ serie, type }) => {
  const params = useParams();
  const objectid = params;
  const id = (objectid && objectid.movieid) || (objectid && objectid.tvid);

  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const [movie, setMovie] = useState<any>(null);
  const [director, setDirector] = useState([]);
  const [genres, setGenres] = useState([]);
  const [ProductionCompanies, setProductionCompanies] = useState([]);
  const [SocialMedia, setSocialMedia] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [creator, setCreator] = useState([]);
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
            if (type === 'movie') {
              axios
                .get(
                  `https://api.themoviedb.org/3/${type}/${movieId}?api_key=${apiKey}&append_to_response=credits`
                )
                .then((response) => {
                  const credits = response.data.credits;
                  console.log(response);

                  const director = credits.crew
                    .filter((person: any) => person.job === 'Director')
                    .map((director: any) => director);
                  const genres = results.genres.map((genre: any) => genre);
                  setDirector(director);
                  setGenres(genres);
                });
            } else {
              axios
                .get(
                  `https://api.themoviedb.org/3/${type}/${movieId}?api_key=${apiKey}&append_to_response=credits&append_to_response=created_by`
                )
                .then((response) => {
                  console.log(response);

                  const director = response.data.created_by.map(
                    (creator: any) => creator
                  );
                  const genres = results.genres.map((genre: any) => genre);
                  console.log(genres);
                  setCreator(director);
                  setGenres(genres);
                });
            }
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
        <TabList className='flex justify-center lg:gap-12 gap-2'>
          <Tab className={TabStyle}>OVERVIEW</Tab>
          {serie && <Tab className={TabStyle}>EPISODES</Tab>}
          <Tab className={TabStyle}>VIDEOS</Tab>
          <Tab className={TabStyle}>PHOTOS</Tab>
        </TabList>
        <TabPanel className={TabPanelStyle}>
          <Overview
            item={movie}
            director={type === 'tv' ? creator : director}
            genres={genres}
            ProductionCompanies={ProductionCompanies}
            SocialMedia={SocialMedia}
            id={id}
            seasons={seasons}
            type={type}
            serie={serie}
          />
        </TabPanel>
        {serie && (
          <TabPanel className={TabPanelStyle}>
            <EpisodeList id={id} />
          </TabPanel>
        )}
        <TabPanel className={TabPanelStyle}>
          <VideoList id={id} type={type} />
        </TabPanel>
        <TabPanel className={TabPanelStyle}>
          <Photos id={id} type={type} />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default TabsComponent;
