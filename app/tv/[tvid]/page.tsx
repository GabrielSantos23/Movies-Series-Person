'use client';

import TabsComponent from '@/app/components/Tabs/Tabs';
import HeaderDetails from '@/app/components/headers/HeaderDetails';

const page = () => {
  return (
    <div>
      <HeaderDetails type={'tv'} link={`https://embed.warezcdn.com/serie`} />
      <TabsComponent type={'tv'} serie />
    </div>
  );
};

export default page;
