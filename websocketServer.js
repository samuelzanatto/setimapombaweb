import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';  // Adicionar WebSocket na importação
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

const HEARTBEAT_INTERVAL = 30000;

const prisma = new PrismaClient();
const app = express();

app.use(cors({
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
}));

const server = createServer(app);
const wss = new WebSocketServer({ 
    server,
    path: '/ws',
    clientTracking: true
});

const userConnections = new Map();

wss.on('error', (error) => {
    console.error('Erro no servidor WebSocket:', error);
});

wss.on('connection', async (ws, req) => {
    console.log('[Server] Nova conexão WebSocket estabelecida');
    console.log('[Server] IP Cliente:', req.socket.remoteAddress);
    console.log('[Server] Total de clientes:', wss.clients.size);

    ws.isAlive = true;
    let userId = null;

    const pingInterval = setInterval(() => {
        if (ws.isAlive === false) {
            console.log('[Server] Cliente inativo, terminando conexão');
            clearInterval(pingInterval);
            return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
    }, HEARTBEAT_INTERVAL);

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.on('message', async (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log('[Server] Mensagem recebida:', data);

            if (data.type === 'user_connected' && data.userId) {
                console.log('[Server] Usuário conectado:', data.userId);
                userId = parseInt(data.userId);
                if (isNaN(userId)) {
                    console.error('[Server] UserId inválido:', data.userId);
                    return;
                }

                console.log('[Server] Usuário conectado:', userId);

                // Remove conexão antiga se existir
                if (userConnections.has(userId)) {
                    console.log('[Server] Fechando conexão antiga do usuário:', userId);
                    const oldConnection = userConnections.get(userId);
                    oldConnection.close();
                    userConnections.delete(userId);
                }

                // Registra nova conexão
                userConnections.set(userId, ws);

                // Atualiza status no banco
                await prisma.user.update({
                    where: { id: userId },
                    data: { online: true }
                });

                // Notifica todos os clientes
                broadcastUserStatus(userId, true);
                
                console.log('[Server] Status do usuário atualizado para online:', userId);
            }
        } catch (error) {
            console.error('[Server] Erro ao processar mensagem:', error);
        }
    });

    ws.on('close', async () => {
        console.log('[Server] Cliente desconectado');
        console.log('[Server] Clientes restantes:', wss.clients.size);
        
        clearInterval(pingInterval);
        if (userId) {
            try {
                console.log('[Server] Conexão fechada para usuário:', userId);
                userConnections.delete(userId);

                await prisma.user.update({
                    where: { id: userId },
                    data: { online: false }
                });

                broadcastUserStatus(userId, false);
                console.log('[Server] Status do usuário atualizado para offline:', userId);
            } catch (error) {
                console.error('[Server] Erro ao desconectar usuário:', error);
            }
        }
    });
});

function broadcastUserStatus(userId, online) {
    const message = JSON.stringify({
        type: 'status_change',
        userId,
        online
    });

    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

const PORT = process.env.NEXT_PUBLIC_WS_PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor WebSocket rodando em http://0.0.0.0:${PORT}`);
});

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Servidor WebSocket encerrado');
        process.exit(0);
    });
});

export default server;