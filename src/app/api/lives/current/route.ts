import { headers } from 'next/headers';
import { getPrivateLiveStream } from '@/lib/youtube';
import { prisma } from '@/lib/prisma';
import { jwtDecode } from 'jwt-decode';

export async function GET() {
  try {
    const headersList = headers();
    const token = (await headersList).get('Authorization')?.replace('Bearer ', '');
    console.log('[Lives API] Token recebido:', token?.substring(0, 20) + '...');

    if (!token) {
      console.log('[Lives API] Token não encontrado');
      return Response.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const decoded = jwtDecode(token) as { userId: number };
    console.log('[Lives API] UserId decodificado:', decoded.userId);

    const userData = await prisma.user.findFirst({
      where: {
        id: decoded.userId
      },
      select: {
        email: true
      }
    });

    console.log('[Lives API] Dados do usuário:', userData);

    if (!userData?.email) {
      console.log('[Lives API] Email não encontrado para usuário:', decoded.userId);
      return Response.json({ error: 'Email não encontrado' }, { status: 401 });
    }

    console.log('[Lives API] Buscando live stream...');
    const liveStream = await getPrivateLiveStream();
    console.log('[Lives API] Live stream encontrada:', liveStream);

    if (!liveStream) {
      console.log('[Lives API] Nenhuma live ativa encontrada');
      return Response.json({ live: null });
    }

    const response = {
      live: {
        id: liveStream.id,
        title: liveStream.title,
        thumbnail: liveStream.thumbnail,
        embedHtml: liveStream.embedHtml,
        authorizedEmail: userData.email,
        status: liveStream.status,
        privacy: liveStream.privacy,
        startTime: liveStream.actualStartTime
      }
    };

    console.log('[Lives API] Resposta final:', response);
    return Response.json(response);
  } catch (error) {
    console.error('[Lives API] Erro:', error);
    return Response.json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    }, { status: 500 });
  }
}