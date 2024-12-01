import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})

export async function GET() {
  try {
    // Buscar live atual no YouTube
    const response = await youtube.search.list({
      part: ['snippet'],
      channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
      eventType: 'live',
      type: ['video'],
      maxResults: 1
    })

    const currentLive = response.data.items?.[0]

    if (currentLive?.id?.videoId) {
      // Buscar ou criar live no banco
      const live = await prisma.live.upsert({
        where: {
          youtubeId: currentLive.id.videoId
        },
        update: {
          title: currentLive.snippet?.title || '',
          isActive: true
        },
        create: {
          youtubeId: currentLive.id.videoId,
          title: currentLive.snippet?.title || '',
          isActive: true
        },
        include: {
          leituras: true,
          mensagens: true,
          pedidosOracao: true,
          viewerSessions: {
            where: {
              endedAt: null
            }
          }
        }
      })

      return Response.json({
        liveId: live.youtubeId,
        title: live.title,
        viewers: live.viewerSessions.length,
        ofertaAtiva: live.ofertaAtiva,
        leituras: live.leituras,
        mensagens: live.mensagens,
        pedidosOracao: live.pedidosOracao
      })
    }

    return Response.json({ liveId: null })
  } catch (error) {
    console.error('Erro ao buscar live atual:', error)
    return Response.json({ error: 'Falha ao buscar live atual' }, { status: 500 })
  }
}