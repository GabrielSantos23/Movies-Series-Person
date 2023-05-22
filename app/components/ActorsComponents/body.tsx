'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import WebsiteIcon from '../../../public/assets/website';
import Twitter from '../../../public/assets/twitter';
import Facebook from '../../../public/assets/facebooks';
import Instagram from '../../../public/assets/instagram';
import Imdb from '../../../public/assets/Imdb';
import HelmetComponent from '../../components/Helmet';
import Placeholder from '../../../public/assets/placeholder';
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';

const ActorBody = () => {
  const [person, setPerson] = useState<any>([]);
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  const params = useParams();
  const objectid = params;
  const id = objectid && objectid.personid;

  const [SocialMedia, setSocialMedia] = useState<any>([]);

  useEffect(() => {
    if (id) {
      axios
        .get(
          `https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&language=en-US`
        )
        .then((response) => {
          const actors = response.data;
          setPerson(actors);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getAge = (birthdate: any) => {
    const now = new Date();
    const birthdateParts = birthdate?.split('-');
    const birthdateObj = new Date(
      birthdateParts[0],
      birthdateParts[1] - 1,
      birthdateParts[2]
    );
    let age = now.getFullYear() - birthdateObj.getFullYear();
    const monthDiff = now.getMonth() - birthdateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && now.getDate() < birthdateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  const releaseDateFormatted = person.birthday
    ? format(new Date(`${person.birthday}T00:00:00`), 'dd MMMM yyyy')
    : null;

  useEffect(() => {
    if (id) {
      axios
        .get(
          `
            https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${apiKey}&language=en-US`
        )
        .then((response) => {
          const actors = response.data;
          setSocialMedia(actors);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [id]);

  const agebirh = (
    <div>
      {person.birthday ? (
        <p>
          {releaseDateFormatted} (age {getAge(person?.birthday)})
        </p>
      ) : null}
    </div>
  );
  const dtStyle = 'basis-[30%] shrink-0 font-light';
  const ddStyle = 'basis-[70%] font-light';
  return (
    <>
      <div className='flex mt-10  gap-10 items-start flex-wrap text-base '>
        <HelmetComponent title={`${person.name}`} />
        <div className='h-[500px] bg-[#202124]'>
          {person.profile_path ? (
            <LazyLoadImage
              src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
              alt=''
              threshold={0}
              className='max-w-[350px]'
              effect='opacity'
            />
          ) : (
            <Placeholder />
          )}
        </div>
        <div>
          <h1 className='text-2xl font-normal mb-5'>{person.name}</h1>

          {person.biography &&
            person.biography
              ?.split('\n\n')
              .map((paragraph: any, index: any) => (
                <div
                  className='max-w-[1000px] tracking-[0.03125rem] leading-5 text-sm'
                  key={index}
                >
                  {paragraph}
                </div>
              ))}

          <div>
            <dl className='flex mt-5 gap-2 max-w-[700px] flex-col w-full'>
              {person.known_for_department ? (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Know For</dt>
                    <dd className={ddStyle}>{person.known_for_department}</dd>
                  </>
                </div>
              ) : null}
              {person.birthday ? (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Born</dt>
                    <dd className={ddStyle}>
                      {person.deathday ? null : agebirh}
                    </dd>
                  </>
                </div>
              ) : null}
              {person.place_of_birth ? (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Place of Birth</dt>
                    <dd className={ddStyle}>{person.place_of_birth}</dd>
                  </>
                </div>
              ) : null}
              {person.deathday ? (
                <div className='flex items-start'>
                  <>
                    <dt className={dtStyle}>Death</dt>
                    <dd className={ddStyle}>{releaseDateFormatted}</dd>
                  </>
                </div>
              ) : null}
            </dl>
          </div>

          <div style={{ display: 'flex', gap: '25px', marginTop: '20px' }}>
            {SocialMedia.twitter_id ? (
              <a
                href={`https://twitter.com/${SocialMedia.twitter_id}`}
                target='_blank'
              >
                <Twitter />
              </a>
            ) : null}

            {SocialMedia.facebook_id ? (
              <a
                href={`https://www.facebook.com/${SocialMedia.facebook_id}`}
                target='_blank'
              >
                <Facebook />
              </a>
            ) : null}

            {SocialMedia.instagram_id ? (
              <a
                href={`https://www.instagram.com/${SocialMedia.instagram_id}`}
                target='_blank'
              >
                <Instagram />
              </a>
            ) : null}

            {SocialMedia.imdb_id ? (
              <a
                href={`https://www.imdb.com/name/${SocialMedia.imdb_id}`}
                target='_blank'
              >
                <Imdb />
              </a>
            ) : null}

            {person.homepage ? (
              <a href={person.homepage} target='_blank'>
                <WebsiteIcon />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default ActorBody;
