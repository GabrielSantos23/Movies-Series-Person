'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { signIn, useSession, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Input from '@/app/components/Inputs/Input';
import Button from '@/app/components/Buttons/Button';
import AuthSocialButton from '@/app/components/Buttons/AuthSocialButton';
import HelmetComponent from '@/app/components/Helmet';

type Variant = 'REGISTER' | 'LOGIN';

const Auth = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchData = async () => {
        const session = await getSession();
        if (session) {
          console.log(session.user);
          router.push('/user');
        }
      };

      fetchData();
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      //   router.push('/users');
      console.log('registered');
    }
  }, [status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === 'LOGIN') {
      setVariant('REGISTER');
    } else {
      setVariant('LOGIN');
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === 'REGISTER') {
      axios
        .post('/api/register', data)

        .then(() =>
          signIn('credentials', {
            ...data,
            redirect: false,
          })
        )
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials!', {
              style: {
                backgroundColor: 'black',
                color: 'white',
              },
            });
          }

          if (callback?.ok) {
            router.push('/user');
          }
        })
        .catch(() =>
          toast.error('Something went wrong!', {
            style: {
              backgroundColor: 'black',
              color: 'white',
            },
          })
        )
        .finally(() => setIsLoading(false));
    }

    if (variant === 'LOGIN') {
      signIn('credentials', {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error('Invalid credentials!', {
              style: {
                backgroundColor: 'black',
                color: 'white',
              },
            });
          } else if (callback?.ok) {
            toast.success('Logged in!', {
              style: {
                backgroundColor: 'black',
                color: 'white',
              },
            });
            router.push('/user');
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials!', {
            style: {
              backgroundColor: 'black',
              color: 'white',
            },
          });
        }

        if (callback?.ok) {
          router.push('/user');
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <HelmetComponent title={variant === 'LOGIN' ? 'Login' : 'Register'} />
      <div className='flex min-w-[300px] lg:min-w-[550px]  rounded-sm p-5 flex-col bg-black'>
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
          {variant === 'REGISTER' && (
            <Input
              label='Name'
              register={register}
              id='name'
              errors={errors}
              type='text'
              disabled={isLoading}
            />
          )}
          <Input
            label='Email address'
            register={register}
            id='email'
            errors={errors}
            type='email'
            disabled={isLoading}
          />

          <Input
            label='Password'
            register={register}
            id='password'
            errors={errors}
            type='password'
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type='submit'>
              {variant === 'LOGIN' ? 'Sign in' : 'Register'}
            </Button>
          </div>
        </form>
        <div className='relative py-5'>
          <div className='absolute inset-0 flex items-center'>
            <div
              className={`w-full border-t border-gray-700
                } `}
            />
          </div>
          <div className='relative flex justify-center text-sm'>
            <span
              className={`bg-black
                 px-2 text-gray-500`}
            >
              Or continue with
            </span>
          </div>
        </div>
        <div className='flex  gap-2'>
          <AuthSocialButton
            onClick={() => socialAction('github')}
            icon={BsGithub}
          />
          <AuthSocialButton
            onClick={() => socialAction('google')}
            icon={BsGoogle}
          />
        </div>

        <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
          <div>
            {variant === 'LOGIN' ? 'New Here?' : 'Already have an account'}
          </div>
          <div
            className={`underline cursor-pointer  text-gray-400
            `}
            onClick={toggleVariant}
          >
            {variant === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
