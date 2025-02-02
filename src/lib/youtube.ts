import { google } from 'googleapis';

const youtube = google.youtube('v3');

export async function getPrivateLiveStream() {
  try {
    console.log('[YouTube API] Iniciando busca por live privada...');

    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.REDIRECT_URI
    );

    oauth2Client.setCredentials({
      access_token: process.env.YOUTUBE_ACCESS_TOKEN,
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
    });

    const broadcastResponse = await youtube.liveBroadcasts.list({
      auth: oauth2Client,
      part: ['snippet', 'contentDetails', 'status'],
      broadcastStatus: 'active',
      broadcastType: 'all',
      maxResults: 50
    });

    console.log('[YouTube API] Broadcasts encontrados:', 
      JSON.stringify(broadcastResponse.data, null, 2)
    );

    if (broadcastResponse.data.items?.length > 0) {
      const broadcast = broadcastResponse.data.items[0];
      
      // Retornar informações formatadas da live
      return {
        id: broadcast.id,
        videoId: broadcast.contentDetails?.boundStreamId,
        title: broadcast.snippet.title,
        description: broadcast.snippet.description,
        thumbnail: broadcast.snippet.thumbnails?.high?.url,
        status: broadcast.status.lifeCycleStatus,
        privacy: broadcast.status.privacyStatus,
        embedHtml: broadcast.contentDetails.monitorStream.embedHtml,
        actualStartTime: broadcast.snippet.actualStartTime
      };
    }

    return null;

  } catch (error) {
    console.error('[YouTube API] Erro:', error);
    throw error;
  }
}