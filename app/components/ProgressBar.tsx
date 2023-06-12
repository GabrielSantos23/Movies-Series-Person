'use client';

import { useState, useEffect } from 'react';
import TopBarProgress from 'react-topbar-progress-indicator';
import { usePathname } from 'next/navigation';

const CustomSwitch = ({ children }: { children: React.ReactNode }) => {
  TopBarProgress.config({
    barColors: {
      0: '#2196F3',
      '1.0': '#2196F3',
    },
  });

  const [progress, setProgress] = useState(false);
  const [prevLoc, setPrevLoc] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    setPrevLoc(pathname);
    setProgress(true);

    if (pathname === prevLoc) {
      setPrevLoc('');
    }
  }, [pathname]);

  useEffect(() => {
    setProgress(false);
  }, [prevLoc]);

  return (
    <>
      {progress && <TopBarProgress />}
      <>{children}</>
    </>
  );
};

export default CustomSwitch;
