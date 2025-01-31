import { google } from 'googleapis';

const youtube = google.youtube('v3');

export async function getPrivateLiveStream() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.YOUTUBE_REFRESH_TOKEN
    });

    const response = await youtube.search.list({
      auth: oauth2Client,
      part: ['snippet', 'id'],
      channelId: process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
      eventType: 'live',
      type: 'video'
    });

    return response.data.items?.[0];
  } catch (error) {
    console.error('[YouTube API] Erro:', error);
    throw error;
  }
}