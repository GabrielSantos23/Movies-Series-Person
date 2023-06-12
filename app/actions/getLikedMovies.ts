'use client';

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { LikedMovies } from '@/types';
import { cookies } from 'next/headers';
const getLikedMovies = async (): Promise<LikedMovies[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data, error } = await supabase
    .from('liked_movies')
    .select('*, movies(*)')
    .eq('user_id', session?.user?.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.log(error);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    ...item.movies,
  }));
};

export default getLikedMovies;
