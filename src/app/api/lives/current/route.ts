import { getPrivateLiveStream } from '@/lib/youtube';

export async function GET() {
  try {
    // Obter usuário autenticado
    const token = headers().get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return Response.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const userData = await prisma.user.findFirst({
      where: {
        id: parseInt(userId)
      },
      select: {
        email: true
      }
    });

    if (!userData?.email) {
      return Response.json({ error: 'Email não encontrado' }, { status: 401 });
    }

    const liveStream = await getPrivateLiveStream();
    if (!liveStream) {
      return Response.json({ live: null });
    }

    return Response.json({
      live: {
        id: liveStream.id.videoId,
        title: liveStream.snippet.title,
        thumbnail: liveStream.snippet.thumbnails.high.url,
        authorizedEmail: userData.email
      }
    });
  } catch (error) {
    console.error('Erro ao buscar live:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}