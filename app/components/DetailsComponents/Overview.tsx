'use client';
import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import '../carousel/carouselStyle.css';
import Twitter from './../../../public/assets/twitter';
import Facebook from './../../../public/assets/facebooks';
import Instagram from './../../../public/assets/instagram';
import Imdb from './../../../public/assets/Imdb';
import WebsiteIcon from './../../../public/assets/website';
const apiKey = process.env.NEXT_PUBLIC_API_KEY;
import { motion } from 'framer-motion';

import ItemsCarousel from '../carousel/ItemsCarousel';
import Link from 'next/link';
interface OverviewProps {
  item: any;
  director: any;
  genres: any;
  ProductionCompanies: any;
  SocialMedia: any;
  id: string | string[] | null;
  seasons: any[];
  type: any;
  serie?: boolean;
}

const Overview: React.FC<OverviewProps> = ({
  item,
  director,
  genres,
  ProductionCompanies,
  SocialMedia,
  id,
  seasons,
  type,
  serie,
}) => {
  const imageUrl = `https://image.tmdb.org/t/p/w500${item?.poster_path}`;
  const dtStyle = 'basis-[30%] shrink-0 font-light';
  const ddStyle = 'basis-[70%] font-light';

  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const runtimeMinutes =
    item?.runtime || (item?.episode_run_time && item?.episode_run_time[0]) || 0;
  let runtimeFormatted;
  if (runtimeMinutes < 60) {
    runtimeFormatted = `${runtimeMinutes}m`;
  } else {
    const runtimeHours = Math.floor(runtimeMinutes / 60);
    const runtimeMinutesRemainder = runtimeMinutes % 60;
    runtimeFormatted = `${runtimeHours}h ${runtimeMinutesRemainder}min`;
  }
  {
  }
  return (
    <>
      <div className='flex  flex-col lg:flex-row mt-10 gap-5 mb-10'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, type: 'linear' }}
          className='flex justify-center lg:justify-start'
        >
          <LazyLoadImage
            className='imageComponentPoster min-w-[300px] lg:min-w-[400px]'
            src={item?.poster_path ? imageUrl : '/assets/placeholder.png'}
            alt={item.title || item.name}
            threshold={0}
            effect='opacity'
            afterLoad={handleImageLoad}
            placeholderSrc='/assets/placeholder.png'
          />
        </motion.div>
        <div>
          {item.overview && (
            <>
              <p className='text-2xl mb-3  font-medium'>Storyline</p>
              <p className=' lg:pr-40'>{item?.overview}</p>
            </>
          )}
          <div>
            <dl className='flex mt-5 gap-2 max-w-[700px] flex-col w-full'>
              <div className='flex items-center'>
                <dt className={dtStyle}>
                  {item?.release_date ? 'Released' : null}
                  {item?.first_air_date ? 'First Air Date' : null}
                </dt>
                <dd className={ddStyle}>
                  {item?.release_date
                    ? item?.release_date
                    : item?.first_air_date}
                </dd>
              </div>

              {item?.last_air_date && (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Last Aired</dt>
                    <dd className={ddStyle}>{item?.last_air_date}</dd>
                  </>
                </div>
              )}

              {item?.runtime > 0 && (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Runtime</dt>
                    <dd className={ddStyle}>
                      {item?.runtime > 0 ? runtimeFormatted : null}
                    </dd>
                  </>
                </div>
              )}

              {director?.length > 0 && (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>
                      {type === 'tv' ? 'Creator' : 'Director'}
                    </dt>
                    {director.map((dir: any, index: number) => (
                      <React.Fragment key={dir.id}>
                        <Link href={`/person/${dir.id}`}>
                          <dd className={`${ddStyle} text-sky-500 underline`}>
                            {dir.name}
                          </dd>
                        </Link>
                        {index < director.length - 1 && <span>,&nbsp;</span>}
                      </React.Fragment>
                    ))}
                  </>
                </div>
              )}

              {item?.budget ? (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Budget</dt>
                    <dd className={ddStyle}>
                      {item?.budget == 0
                        ? null
                        : `$${item?.budget?.toLocaleString()}`}
                    </dd>
                  </>
                </div>
              ) : null}

              {item?.revenue ? (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Revenue</dt>
                    <dd className={ddStyle}>
                      {item?.revenue === 0
                        ? null
                        : `$${item?.revenue?.toLocaleString()}`}
                    </dd>
                  </>
                </div>
              ) : null}

              {genres?.length > 0 && (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Genres</dt>
                    <dd className={`${ddStyle} flex flex-wrap`}>
                      {genres.map((genre: any, index: number) => (
                        <React.Fragment key={genre.id}>
                          <Link
                            href={{
                              pathname: `/genre/${genre.id}`,
                              query: { type: type, title: genre.name },
                            }}
                          >
                            <dd className={`${ddStyle} text-sky-500 underline`}>
                              {genre.name}
                            </dd>
                          </Link>
                          {index < genres.length - 1 && <span>,&nbsp;</span>}
                        </React.Fragment>
                      ))}
                    </dd>
                  </>
                </div>
              )}

              {item.number_of_seasons && (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Seasons</dt>
                    <dd className={ddStyle}>{item.number_of_seasons}</dd>
                  </>
                </div>
              )}

              {item.number_of_episodes && (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Episodes</dt>
                    <dd className={ddStyle}>{item.number_of_episodes}</dd>
                  </>
                </div>
              )}

              {item.status && (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Status</dt>
                    <dd className={ddStyle}>{item.status}</dd>
                  </>
                </div>
              )}

              {item.original_language && (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Original Language</dt>
                    <dd className={ddStyle}>{item.original_language}</dd>
                  </>
                </div>
              )}

              {ProductionCompanies && (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Production</dt>
                    <dd className={ddStyle}>{ProductionCompanies}</dd>
                  </>
                </div>
              )}
            </dl>
            <div className='flex gap-6 mt-5'>
              {SocialMedia.twitter_id && (
                <a
                  href={`https://twitter.com/${SocialMedia.twitter_id}`}
                  target='_blank'
                >
                  <Twitter />
                </a>
              )}
              {SocialMedia.facebook_id && (
                <a
                  href={`https://www.facebook.com/${SocialMedia.facebook_id}`}
                  target='_blank'
                >
                  <Facebook />
                </a>
              )}

              {SocialMedia.instagram_id && (
                <a
                  href={`https://www.instagram.com/${SocialMedia.instagram_id}`}
                  target='_blank'
                >
                  <Instagram />
                </a>
              )}

              {SocialMedia.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${SocialMedia.imdb_id}`}
                  target='_blank'
                >
                  <Imdb />
                </a>
              )}

              {item?.homepage && (
                <a href={item?.homepage} target='_blank'>
                  <WebsiteIcon />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
      <ItemsCarousel
        urltype={`${type}/${id}/credits?api_key=${apiKey}`}
        title='Cast'
        type={'person'}
        url='person'
      />
      <ItemsCarousel
        urltype={`${type}/${id}/recommendations?api_key=${apiKey}`}
        title='More Like This'
        type={'similar'}
        url={serie ? 'tv' : 'movie'}
        serie={serie}
        explore
      />
    </>
  );
};

export default Overview;
