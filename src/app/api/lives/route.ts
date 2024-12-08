import { google } from 'googleapis';
import { cache } from '@/lib/cache';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

export async function GET() {
  try {
    const CACHE_KEY = 'youtube-lives'
    const cachedData = cache.get(CACHE_KEY)
    
    if (cachedData) {
      console.log('Retornando dados do cache')
      return Response.json(cachedData)
    }

    console.log('Iniciando busca de transmissões...');
    
    // Busca por todas as transmissões (ativas e agendadas)
    const upcomingResponse = await youtube.search.list({
      part: ['snippet'],
      channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
      eventType: 'upcoming',
      type: ['video'],
    });

    console.log('Resposta upcoming:', upcomingResponse.data);

    // Busca por transmissões ao vivo ativas
    const liveResponse = await youtube.search.list({
      part: ['snippet'],
      channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
      eventType: 'live',
      type: ['video'],
    });

    console.log('Resposta live:', liveResponse.data);

    // Busca por transmissões completadas
    const completedResponse = await youtube.search.list({
      part: ['snippet'],
      channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
      eventType: 'completed',
      type: ['video'],
      order: 'date',
      maxResults: 50
    });

    console.log('Resposta completed:', completedResponse.data);

    // Se não encontrou nada em nenhuma das buscas, tenta uma busca mais ampla
    if (!upcomingResponse.data.items?.length && 
        !liveResponse.data.items?.length && 
        !completedResponse.data.items?.length) {
      
      console.log('Nenhuma transmissão encontrada, tentando busca alternativa...');
      
      // Busca alternativa sem filtro de eventType
      const alternativeResponse = await youtube.search.list({
        part: ['snippet'],
        channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
        type: ['video'],
      });

      console.log('Resposta alternativa:', alternativeResponse.data);

      // Filtra apenas vídeos que têm relação com transmissões ao vivo
      const filteredItems = alternativeResponse.data.items?.filter(item =>
        item.snippet?.liveBroadcastContent !== 'none'
      ) || [];

      if (filteredItems.length > 0) {
        const lives = await Promise.all(
          filteredItems.map(async (item) => {
            try {
              const videoDetails = await youtube.videos.list({
                part: ['snippet', 'liveStreamingDetails'],
                id: [item.id.videoId]
              });

              console.log(`Detalhes do vídeo ${item.id.videoId}:`, videoDetails.data);

              const videoData = videoDetails.data.items?.[0];
              if (!videoData?.liveStreamingDetails) return null;

              return {
                id: item.id?.videoId,
                title: item.snippet?.title,
                thumbnail: item.snippet?.thumbnails?.medium?.url,
                description: item.snippet?.description,
                status: item.snippet?.liveBroadcastContent,
                scheduledStartTime: videoData.liveStreamingDetails?.scheduledStartTime,
                actualStartTime: videoData.liveStreamingDetails?.actualStartTime,
                actualEndTime: videoData.liveStreamingDetails?.actualEndTime,
                publishedAt: item.snippet?.publishedAt
              };
            } catch (error) {
              console.error(`Erro ao buscar detalhes do vídeo ${item.id.videoId}:`, error);
              return null;
            }
          })
        );

        const validLives = lives.filter(Boolean);
        
        if (validLives.length > 0) {
          console.log('Lives encontradas na busca alternativa:', validLives);
          return Response.json({ lives: validLives });
        }
      }
    }

    // Processa os resultados originais se encontrou algo
    const allItems = [
      ...(upcomingResponse.data.items || []),
      ...(liveResponse.data.items || []),
      ...(completedResponse.data.items || [])
    ];

    console.log('Total de itens encontrados:', allItems.length);

    if (allItems.length === 0) {
      console.log('Nenhuma transmissão encontrada em nenhuma das buscas');
      return Response.json({ 
        lives: [],
        debug: {
          channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
          upcomingCount: upcomingResponse.data.items?.length || 0,
          liveCount: liveResponse.data.items?.length || 0,
          completedCount: completedResponse.data.items?.length || 0
        }
      });
    }

    const detailedLives = await Promise.all(
        allItems.map(async (item) => {
          try {
            const videoDetails = await youtube.videos.list({
              part: ['snippet', 'liveStreamingDetails'],
              id: [item.id.videoId]
            });
        
            const details = videoDetails.data.items?.[0];
            if (!details) return null;
        
            // Determina o status baseado nos detalhes do vídeo
            let status: 'live' | 'upcoming' | 'completed';
            const now = new Date().getTime();
            const startTime = details.liveStreamingDetails?.scheduledStartTime;
            const endTime = details.liveStreamingDetails?.actualEndTime;
            const isLiveNow = details.snippet?.liveBroadcastContent === 'live';
        
            if (isLiveNow) {
              status = 'live';
            } else if (startTime && new Date(startTime).getTime() > now) {
              status = 'upcoming';
            } else if (endTime || details.snippet?.liveBroadcastContent === 'none') {
              status = 'completed';
            } else {
              status = 'completed'; // fallback para vídeos regulares
            }
        
            return {
              id: item.id.videoId,
              title: details.snippet?.title,
              thumbnail: details.snippet?.thumbnails?.medium?.url,
              description: details.snippet?.description,
              status,
              publishedAt: details.snippet?.publishedAt,
              scheduledStartTime: details.liveStreamingDetails?.scheduledStartTime,
              actualStartTime: details.liveStreamingDetails?.actualStartTime,
              actualEndTime: details.liveStreamingDetails?.actualEndTime
            };
            } catch (error) {
                console.error(`Erro ao buscar detalhes do vídeo ${item.id.videoId}:`, error);
                return null;
            }
        })
    );

    const lives = detailedLives
      .filter(Boolean)
      .sort((a, b) => {
        const dateA = a.scheduledStartTime || a.actualStartTime || a.publishedAt;
        const dateB = b.scheduledStartTime || b.actualStartTime || b.publishedAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

    console.log('Lives processadas:', lives);

    const result = { lives }
    cache.set(CACHE_KEY, result)
    return Response.json(result)

  } catch (error) {
    console.error('Erro na API:', error);
    return Response.json(
      { 
        error: 'Falha ao buscar transmissões', 
        details: error.message,
        debug: {
          channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
          errorStack: error.stack
        }
      },
      { status: 500 }
    );
  }
}