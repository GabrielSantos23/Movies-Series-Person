'use client';

import Avatar from '@/app/components/Avatar';
import Button from '@/app/components/Buttons/Button';
import Loading from '@/app/components/Loadings/loading';
import ProfileTabs from '@/app/components/Tabs/ProfileTabs';
import { signIn, useSession, getSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Body = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>([]);

  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        const session = await getSession();
        if (session) {
          setUserInfo(session.user);
          setLoading(false);
        } else {
          router.push('/profile');
          setLoading(false);
        }
      };

      fetchData();
    } else {
      router.push('/profile');
    }
  }, [status, router]);
  
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className='flex pl-10 mt-10 justify-between items-center'>
            <div className='flex flex-col gap-5'>
              <Avatar imageUrl={`${userInfo?.image}`} />
              <div>{userInfo.name}</div>
            </div>
            <div className='pr-10'>
              <Button secondary onClick={() => signOut()}>
                SignOut
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
