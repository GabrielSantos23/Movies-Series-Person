'use client';

import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { AiOutlineClose } from 'react-icons/ai';

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any | null>(null);
  const [isComponentOpen, setIsComponentOpen] = useState<boolean>(true);
  const [cookies, setCookie] = useCookies(['appInstalled']);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Usuário aceitou a instalação');
          setCookie('appInstalled', true, { path: '/', maxAge: 2592000 });
          localStorage.removeItem('cookieConsent');
        } else {
          console.log('Usuário recusou a instalação');
          setCookie('appInstalled', false, { path: '/', maxAge: 2592000 });
          localStorage.setItem('cookieConsent', 'false');
          scheduleComponentOpen();
        }
        setDeferredPrompt(null);
      });
    }
  };

  const handleClose = () => {
    setIsComponentOpen(false);
  };

  const scheduleComponentOpen = () => {
    setTimeout(() => {
      setIsComponentOpen(true);
    }, 2 * 24 * 60 * 60 * 1000); // 2 dias em milissegundos
  };

  useEffect(() => {
    if (
      cookies.appInstalled ||
      localStorage.getItem('cookieConsent') === 'false'
    ) {
      setIsComponentOpen(false);
    }
  }, [cookies]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener(
          'beforeinstallprompt',
          handleBeforeInstallPrompt
        );
      }
    };
  }, []);

  const handleBeforeInstallPrompt = (event: any) => {
    event.preventDefault();
    setDeferredPrompt(event);
  };

  if (!isComponentOpen) {
    return null; // Retorna nulo se o componente estiver fechado
  }

  return (
    <div className=' flex items-center justify-between bg-[#202124] h-[50px]  z-[999999999] w-full border-t-2 border-t-black'>
      <div className='flex pl-10 items-center gap-1 text-sm'>
        Do you want to
        <button className='underline' onClick={handleInstall}>
          add this app to your home screen?
        </button>
      </div>
      <button
        className='lg:mr-[100px] border-l-2 border-l-black h-full flex items-center justify-center  p-4 text-2xl'
        onClick={handleClose}
      >
        <AiOutlineClose />
      </button>
    </div>
  );
};

export default InstallButton;
