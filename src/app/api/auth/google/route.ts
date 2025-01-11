import { oauth2Client } from '@/lib/auth';

export async function GET() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube']
  });

  return Response.redirect(authUrl);
}