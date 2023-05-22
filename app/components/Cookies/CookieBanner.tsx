import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import Button from '../Buttons/Button';

export const CookieBanner = () => {
  const [cookies, setCookie] = useCookies(['cookieConsent']);
  const [showBanner, setShowBanner] = useState(!cookies.cookieConsent);

  const handleAcceptCookies = () => {
    setCookie('cookieConsent', true, { path: '/', maxAge: 2592000 });
    setShowBanner(false);
  };

  useEffect(() => {
    if (cookies.cookieConsent) {
      setShowBanner(false);
    }
  }, [cookies]);

  const handleDeclineCookies = () => {
    setCookie('cookieConsent', false, { path: '/', maxAge: 2592000 });
    setShowBanner(false);
  };

  return (
    <>
      {showBanner && (
        <div className='cookie-banner bg-[#202124] flex md:flex-row flex-col md:items-center items-start pl-10 md:pl-0 justify-between p-4 text-sm'>
          <p className='md:ml-10'>
            We use cookies and other tracking technologies to improve your
            browsing experience on our website. By using our website, you
            consent to our use of cookies and other tracking technologies.
          </p>
          <div className='flex gap-3 mr-[100px]'>
            <Button onClick={handleAcceptCookies}>Accept</Button>
            <Button secondary onClick={handleDeclineCookies}>
              Decline
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
