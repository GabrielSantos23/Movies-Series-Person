'use client';

import ActorBody from '@/app/components/ActorsComponents/body';
import ActorTabs from '@/app/components/Tabs/ActorTabs';

const page = () => {
  return (
    <div className='lg:ml-10'>
      <ActorBody />
      <ActorTabs />
    </div>
  );
};

export default page;
