import { google } from 'googleapis'
import { prisma } from '@/lib/prisma'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
})

export async function GET() {
  try {
    // Busca todos os vídeos recentes do canal, sem filtro de eventType
    const response = await youtube.search.list({
      part: ['snippet'],
      channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
      type: ['video'],
      order: 'date',
      maxResults: 5 // Aumenta para pegar mais vídeos recentes
    })

    // Para cada vídeo, verifica detalhes do streaming
    for (const item of response.data.items || []) {
      const videoDetails = await youtube.videos.list({
        part: ['snippet', 'liveStreamingDetails'],
        id: [item.id.videoId]
      })

      const videoData = videoDetails.data.items?.[0]
      
      // Verifica se é uma live (ativa ou agendada)
      if (videoData?.liveStreamingDetails) {
        const isLive = videoData.snippet?.liveBroadcastContent === 'live'
        
        if (isLive) {
          const live = await prisma.live.upsert({
            where: { youtubeId: item.id.videoId },
            update: {
              title: videoData.snippet?.title || '',
              isActive: true
            },
            create: {
              youtubeId: item.id.videoId,
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
          })

          return Response.json({
            liveId: live.youtubeId,
            title: live.title,
            viewers: live.viewerSessions.length,
            ofertaAtiva: false,
            leituras: live.leituras,
            pedidosOracao: live.pedidosOracao
          })
        }
      }
    }

    // Se não encontrou nenhuma live ativa
    return Response.json({ liveId: null })

  } catch (error) {
    console.error('Erro ao buscar live atual:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Falha ao buscar live atual',
        details: error.message
      }),
      { status: 500 }
    )
  }
}