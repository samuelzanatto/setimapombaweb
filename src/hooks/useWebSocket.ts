'use client'

import { useEffect, useRef } from 'react';

type User = {
  id: number;
  username: string;
  name?: string;
  email?: string;
};

export function useWebSocket(user: User | null) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 5;

  useEffect(() => {
    if (!user?.id) {
      console.log('[WebSocket] Aguardando autenticação...');
      if (wsRef.current) {
        wsRef.current.close(1000, 'User logged out');
        wsRef.current = null;
      }
      return;
    }

    const connectWebSocket = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;

      const wsUrl = process.env.NODE_ENV === 'production'
        ? 'wss://websocket-server-kq65.onrender.com'
        : 'ws://localhost:8080';
      
      console.log('[WebSocket] Tentando conectar em:', wsUrl);
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WebSocket] Conexão estabelecida');
        reconnectAttemptsRef.current = 0;
        sendConnectedMessage();
      };

      ws.onclose = (event) => {
        console.log('[Client] WebSocket desconectado:', event.code);
        if (event.code !== 1000 && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          reconnectAttemptsRef.current++;
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, timeout);
        }
      };

      ws.onerror = (error) => {
        console.error('[Client] WebSocket error:', error);
      };
    };

    const sendConnectedMessage = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN && user?.id) {
        try {
          wsRef.current.send(JSON.stringify({
            type: 'user_connected',
            userId: user.id
          }));
          console.log('[Client] Enviado status conectado para userId:', user.id);
        } catch (err) {
          console.error('[Client] Erro ao enviar mensagem:', err);
        }
      }
    };

    setTimeout(connectWebSocket, 1000);

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounted');
      }
    };
  }, [user?.id]);
}