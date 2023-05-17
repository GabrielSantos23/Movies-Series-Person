import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { movieId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const existingFavorite = await prisma.favoriteMovie.findFirst({
      where: {
        userId: currentUser.id,
        movieId: movieId,
      },
    });

    if (existingFavorite) {
      await prisma.favoriteMovie.delete({
        where: {
          id: existingFavorite.id,
        },
      });
      return NextResponse.json({ message: 'Movie removed from favorites' });
    }

    const newFavorite = await prisma.favoriteMovie.create({
      data: {
        userId: currentUser.id,
        movieId: movieId,
      },
    });

    return NextResponse.json({
      message: 'Movie added to favorites',
      favorite: newFavorite,
    });
  } catch (error) {
    console.log(error, 'Error saving movie to favorites');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
