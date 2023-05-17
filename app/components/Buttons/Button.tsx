'use client';

import clsx from 'clsx';
import MoonLoader from 'react-spinners/MoonLoader';
interface ButtonProps {
  type?: 'button' | 'submit' | 'reset' | undefined;
  fullWidth?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  secondary?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type,
  fullWidth,
  children,
  onClick,
  secondary,
  danger,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={clsx(
        `flex justify-center px-3 py-2 text-sm font-semibold items-center focus-visible:outline
        rounded-sm
        focus-visible:outline-2 focus-visible:outline-offset-2`,
        disabled && 'opacity-50 cursor-default capitalize',
        fullWidth && 'w-full',
        type === 'submit' &&
          `inline-flex w-full justify-center rounded-md  bg-gray-950
        px-4 py-2 shadow-sm ring-1 ring-inset ring-gray-800 
         hover:bg-gray-900 focus:outline-offset-0
       
       `,
        secondary
          ? 'text-gray-200 bg-[#202124] hover:bg-[#18191C]'
          : 'text-gray-200',
        danger &&
          'bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-600',
        !secondary &&
          !danger &&
          type !== 'submit' &&
          'bg-sky-500 hover:bg-sky-600 focus-visible:outline-sky-600'
      )}
    >
      {disabled && <MoonLoader color='#fff' size={14} />} &nbsp;
      {children}
    </button>
  );
};

export default Button;
