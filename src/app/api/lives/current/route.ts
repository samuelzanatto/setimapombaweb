import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})

// ID da live privada fixa
const PRIVATE_LIVE_ID = process.env.PRIVATE_LIVE_ID

export async function GET() {
  try {
    // Busca direta do vídeo pelo ID
    const videoDetails = await youtube.videos.list({
      part: ['snippet', 'liveStreamingDetails'],
      id: [PRIVATE_LIVE_ID]
    });

    const videoData = videoDetails.data.items?.[0];

    if (videoData?.liveStreamingDetails) {
      const live = await prisma.live.upsert({
        where: { youtubeId: PRIVATE_LIVE_ID },
        update: {
          title: videoData.snippet?.title || '',
          isActive: true
        },
        create: {
          youtubeId: PRIVATE_LIVE_ID,
          title: videoData.snippet?.title || '',
          isActive: true
        },
        include: {
          leituras: true,
          pedidosOracao: true,
          viewerSessions: {
            where: { endedAt: null }
          }
        }
      });

      return Response.json({
        liveId: live.youtubeId,
        title: live.title,
        viewers: live.viewerSessions.length,
        ofertaAtiva: false,
        leituras: live.leituras,
        pedidosOracao: live.pedidosOracao
      });
    }

    return Response.json({ liveId: null });

  } catch (error) {
    console.error('Erro ao buscar live atual:', error);
    return Response.json(
      { error: 'Falha ao buscar live atual', details: error.message },
      { status: 500 }
    );
  }
}