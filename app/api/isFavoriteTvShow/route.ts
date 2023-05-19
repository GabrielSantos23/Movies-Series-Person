// Importe as dependências necessárias
import { NextResponse } from 'next/server';
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const tvShowId = urlParams.get('tvShowId');

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const existingFavorite = await prisma.favoriteTvShows.findFirst({
      where: {
        userId: currentUser.id,
        tvShowId: String(tvShowId),
      },
    });

    if (existingFavorite) {
      return NextResponse.json(true);
    } else {
      return NextResponse.json(false);
    }
  } catch (error) {
    console.log(error, 'Error checking favorite movie');
    return new NextResponse(`Internal Error ${error}`, { status: 500 });
  }
}
