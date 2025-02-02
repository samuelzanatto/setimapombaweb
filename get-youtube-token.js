import { google } from 'googleapis';
import http from 'http';
import url from 'url';
import open from 'open';
import dotenv from 'dotenv';

dotenv.config();

console.log('Verificando configurações:', {
  clientId: process.env.YOUTUBE_CLIENT_ID?.substring(0, 10) + '...',
  hasSecret: !!process.env.YOUTUBE_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/callback'
});

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.REDIRECT_URI,
);

const scopes = [
  'https://www.googleapis.com/auth/youtube.readonly',
  'https://www.googleapis.com/auth/youtube.force-ssl'
];

async function getNewToken() {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
    client_id: process.env.YOUTUBE_CLIENT_ID
  });

  console.log('Abra este URL para autorizar:', authUrl);
  await open(authUrl);

  const server = http.createServer(async (req, res) => {
    try {
      const queryParams = url.parse(req.url, true).query;
      if (queryParams.code) {
        const { tokens } = await oauth2Client.getToken(queryParams.code);
        console.log('\nTokens obtidos:');
        console.log('Access Token:', tokens.access_token);
        console.log('Refresh Token:', tokens.refresh_token);
        
        res.end('Autenticação concluída! Você pode fechar esta janela.');
        server.close();
      }
    } catch (error) {
      console.error('Erro:', error);
      res.end('Erro na autenticação');
    }
  });

  server.listen(3005, () => {
    console.log('\nAguardando callback na porta 3005...');
  });
}

getNewToken().catch(console.error);