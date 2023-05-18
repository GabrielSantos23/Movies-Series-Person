import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { tvShowId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const existingFavorite = await prisma.favoriteTvShows.findFirst({
      where: {
        userId: currentUser.id,
        tvShowId: tvShowId,
      },
    });

    if (existingFavorite) {
      await prisma.favoriteTvShows.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      return NextResponse.json({ message: 'Tv Show removed from favorites' });
    }

    const newFavorite = await prisma.favoriteTvShows.create({
      data: {
        userId: currentUser.id,
        tvShowId: tvShowId,
      },
    });

    return NextResponse.json({
      message: 'Tv Show added to favorites',
      favorite: newFavorite,
    });
  } catch (error) {
    console.log(error, 'Error saving tv show to favorites');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
