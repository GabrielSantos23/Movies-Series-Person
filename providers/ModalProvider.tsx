'use client';

import AuthModal from '@/app/components/modals/AuthModal';
import NameModal from '@/app/components/modals/NameModal';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <AuthModal />
      <NameModal />
    </>
  );
};

export default ModalProvider;
