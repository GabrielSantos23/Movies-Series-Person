'use client';

import { useContext } from 'react';
import { IconType } from 'react-icons';

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={`inline-flex w-full justify-center rounded-md  bg-gray-950
       px-4 py-2 shadow-sm ring-1 ring-inset ring-gray-800 
        hover:bg-gray-900 focus:outline-offset-0 text-gray-500  transition   hover:text-gray-100
      
      `}
    >
      <Icon className={``} />
    </button>
  );
};

export default AuthSocialButton;
