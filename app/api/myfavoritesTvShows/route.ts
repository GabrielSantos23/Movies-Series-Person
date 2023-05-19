// Importe as dependências necessárias
import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const FavoriteTvShows = await prisma.favoriteTvShows.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    return NextResponse.json(FavoriteTvShows);
  } catch (error) {
    console.log(error, 'Error getting favorite movies');
    return new NextResponse('Internal Error', { status: 500 });
  }
}
