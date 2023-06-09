'use client';

import AuthModal from '@/app/components/modals/AuthModal';
import NameModal from '@/app/components/modals/NameModal';
import SubscribeModal from '@/app/components/modals/SubscribeModal';
import { ProductWithPrice } from '@/types';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ModalProviderProps {
  products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({ products }) => {
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
      <NameModal products={products} />
      <SubscribeModal products={products} />
    </>
  );
};

export default ModalProvider;
