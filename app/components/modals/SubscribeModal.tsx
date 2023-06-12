'use client';

import useSubscribeModal from '@/hooks/useSubscribeModal';
import { useUser } from '@/hooks/useUser';
import { Price, ProductWithPrice } from '@/types';
import { useState } from 'react';
import Button2 from '../Buttons/Button2';
import { toast } from 'react-hot-toast';
import { getStripe } from '@/libs/stripeClient';
import { postData } from '@/libs/helpers';
import Modal2 from './Modal2';

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const formatPrice = (price: Price) => {
  const priceString = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: price.currency,
    minimumFractionDigits: 0,
  }).format((price?.unit_amount || 0) / 100);

  return priceString;
};

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal();
  const { user, isLoading, subscription } = useUser();
  const [loading, setLoading] = useState(false);
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const redirectToCustomerPortal = async () => {
    try {
      const { url, error } = await postData({
        url: '/api/create-portal-link',
      });
      window.location.assign(url);
    } catch (error) {
      if (error) {
        toast.error((error as Error).message);
      }
    }
    setLoading(true);
  };

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  };
  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error('Must be logged in');
    }

    if (subscription) {
      setPriceIdLoading(undefined);
      return toast('Already subscribed');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  let content = <div className='text-center'>No products available.</div>;

  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No prices available</div>;
          }

          return product.prices.map((price) => (
            <Button2
              key={price.id}
              onClick={() => handleCheckout(price)}
              disabled={isLoading || price.id === priceIdLoading}
              className='mb-4 text-white bg-sky-500'
            >
              {`Subscribe for ${formatPrice(price)} a ${price.interval}`}
            </Button2>
          ));
        })}
      </div>
    );
  }

  if (subscription) {
    content = (
      <div className='flex items-center justify-center'>
        <div>
          {subscription && (
            <div className='flex flex-col gap-y-4'>
              <p className='text-center'>
                You are currently on the{' '}
                <b>{subscription?.prices?.products?.name}</b> Plan
              </p>
              <Button2
                className='w-[300px] text-white bg-sky-500  '
                disabled={loading || isLoading}
                onClick={redirectToCustomerPortal}
              >
                Open customer portal
              </Button2>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Modal2
      title='Only for premium users'
      description='See movies and series without ads'
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal2>
  );
};

export default SubscribeModal;
