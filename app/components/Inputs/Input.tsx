'use client';

import clsx from 'clsx';
import { useContext } from 'react';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface InputProps {
  label: string;
  id: string;
  type?: string;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  id,
  type,
  required,
  register,
  errors,
  disabled,
}) => {
  return (
    <div>
      <label
        className={`block text-sm font-medium leading-6 
          text-gray-200
        `}
        htmlFor={id}
      >
        {label}
      </label>
      <div className='mt-2'>
        <input
          type={type}
          autoComplete={id}
          {...register(id, { required })}
          id={type}
          className={clsx(
            ` form-input block focus:outline-none  w-full rounded-md  p-3 bg-[#202124] shadow-sm  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6 
          `,
            errors[id] && 'focus:ring-rose-500',
            disabled && 'opacity-50 cursor-default'
          )}
        />
      </div>
    </div>
  );
};

export default Input;
