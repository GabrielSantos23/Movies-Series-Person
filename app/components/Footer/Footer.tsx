import React from 'react';
import { AiOutlineMail, AiFillLinkedin, AiFillGithub } from 'react-icons/ai';
import Link from 'next/link';

const p = 'text-stone-500 text-sm';
const icon = 'text-lg text-stone-500  hover:text-white transition ';

const Footer = () => {
  return (
    <footer className='ml-10 pb-10 '>
      <p className={p}>
        © {new Date().getFullYear()} Gabriel Santos. All rights reserved
      </p>
      <p className={p}>
        Designed and built by me, data provided by
        <Link
          style={{ color: 'gray' }}
          href={'https://www.themoviedb.org'}
          target='_blank'
        >
          <span className='underline ml-1'>TMDb.</span>
        </Link>
      </p>
      <div className='flex gap-5 mt-1 '>
        <Link
          className={icon}
          href={'https://github.com/GabrielSantos23'}
          target='_blank'
        >
          <AiFillGithub />
        </Link>
        <Link
          className={icon}
          href={'https://www.linkedin.com/in/gabriel-santos-ss/'}
          target='_blank'
        >
          <AiFillLinkedin />
        </Link>

        <Link className={icon} href={'mailto:gabriel.gs605@gmail.com'}>
          <AiOutlineMail />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
