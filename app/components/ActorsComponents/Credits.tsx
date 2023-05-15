import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

interface ActorCreditsProps {
  id: string;
}

const ActorCredits: React.FC<ActorCreditsProps> = ({ id }) => {
  const [credits, setCredits] = useState<any>([]);
  const [selectedJob, setSelectedJob] = useState<any>('');

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${apiKey}&language=en-US`
      );
      const cast = result.data.cast;
      const crew = result.data.crew;
      setCredits([...cast, ...crew]);
    };
    fetchData();
  }, []);

  const jobs = Array.from(
    new Set(
      credits
        .map((credit: { job: any }) => credit.job || 'Acting')
        .filter((job: any): job is string => typeof job === 'string')
    )
  );

  const filteredCredits =
    selectedJob === 'Acting'
      ? credits.filter((credit: any) => !credit.job || credit.job === '')
      : selectedJob === ''
      ? credits
      : credits.filter((credit: any) => credit.job === selectedJob);

  filteredCredits.sort((a: any, b: any) => {
    const dateA = a.release_date || a.first_air_date || '0';
    const dateB = b.release_date || b.first_air_date || '0';
    if (dateA === ' ' && dateB !== ' ') {
      return -1;
    } else if (dateA !== ' ' && dateB === ' ') {
      return 1;
    } else {
      return parseInt(dateB.slice(0, 4)) - parseInt(dateA.slice(0, 4));
    }
  });

  const handleChange = (event: any) => {
    setSelectedJob(event.target.value);
  };

  return (
    <div className=''>
      <label htmlFor='job-select'>Department </label>
      <select
        className='bg-[#202124] rounded-2 p-3 text-sm min-w-[150px] focus:outline-none'
        id='job-select'
        value={selectedJob}
        onChange={handleChange}
      >
        <option value=''>All Jobs</option>
        {jobs.map((job: any) => (
          <option key={job} value={job}>
            {job}
          </option>
        ))}
      </select>
      <div className='flex flex-col gap-1 mt-5'>
        {filteredCredits.map((credit: any, index: any) => (
          <Link
            key={index}
            style={{ textDecoration: 'none', color: 'white' }}
            href={credit.name ? `/tv/${credit.id}` : `/movie/${credit.id}`}
          >
            <div
              className={`flex ${
                credit.popularity > 5 && 'bg-[#202124]'
              } p-3 gap-2 max-w-[90%] `}
            >
              {credit.release_date || credit.first_air_date ? (
                <p
                  className='ml-3'
                  key={credit.credit_id - credit.release_date}
                >
                  {credit.release_date?.slice(0, 4) ||
                    credit.first_air_date?.slice(0, 4)}
                </p>
              ) : (
                <p
                  className='ml-6 mr-4'
                  key={credit.credit_id - credit.release_date}
                >
                  -
                </p>
              )}
              <p
                className='ml-5'
                key={credit.credit_id - credit.title || credit.name}
              >
                {credit.title || credit.name}
              </p>
              {credit.media_type === 'tv' && (
                <p className='text-stone-500 ml-1'>
                  ({credit.episode_count} episodes)
                </p>
              )}
              {credit.character || credit.department ? (
                <p
                  key={credit.credit_id}
                  style={{ color: '#ffffffcf', marginLeft: '10px' }}
                >
                  as {credit.character || credit.department}
                </p>
              ) : null}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ActorCredits;
