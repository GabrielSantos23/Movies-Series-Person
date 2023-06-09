'use client';

import Avatar from '@/app/components/Avatar';
import Button from '@/app/components/Buttons/Button';
import Loading from '@/app/components/Loadings/loading';
import ProfileTabs from '@/app/components/Tabs/ProfileTabs';
import NameModal from '@/app/components/modals/NameModal';
import useLoadImage from '@/hooks/useLoadImage';
import useNameModal from '@/hooks/useNameModal';
import useSubscribeModal from '@/hooks/useSubscribeModal';
import { useUser } from '@/hooks/useUser';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { signIn, useSession, getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const Body = () => {
  const router = useRouter();
  // const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<any>([]);
  const { user, userDetails, subscription } = useUser();
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();

  const namemodal = useNameModal();
  const Submodal = useSubscribeModal();

  useEffect(() => {
    if (user && userDetails && !userDetails.full_name) {
      namemodal.onOpen();
    }
  }, []);

  useEffect(() => {
    if (!session) {
      router.refresh();
      router.push('/profile');
    }
  }, [router, session]);

  const loadImage = useLoadImage(userDetails);

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    router.refresh();

    if (error) {
      toast.error(error.message);
    }

    router.push('/profile');
    toast.success('Logged out');
  };

  const VipHandler = () => {
    if (!subscription) {
      Submodal.onOpen();
    }
  };

  console.log(subscription);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className='flex pl-10 mt-10 justify-between items-center'>
            <div className='flex gap-5'>
              <Avatar imageUrl={`${loadImage}`} />
              <div>
                <p className='text-2xl '>{userDetails?.full_name}</p>
                <button onClick={VipHandler}>
                  <p className='p-1.5 border border-sky-500'>
                    {subscription ? 'VIP' : 'Get VIP'}
                  </p>
                </button>
              </div>
            </div>
            <div className='pr-10 flex flex-col gap-y-4 '>
              <Button secondary onClick={handleLogout}>
                SignOut
              </Button>
              <Button secondary onClick={() => namemodal.onOpen()}>
                Edit Profile
              </Button>
            </div>
          </div>
          <div className='h-full w-full  '>
            <ProfileTabs />
          </div>
        </>
      )}
    </>
  );
};

export default Body;
