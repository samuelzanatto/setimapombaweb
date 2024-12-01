import { io } from 'socket.io-client'

interface Pedido {
  id: string
  para: string
  motivo: string
  createdAt: Date
}

interface Leitura {
  id: string
  texto: string
  minuto: string
  createdAt: Date
}

interface ServerToClientEvents {
  'viewer-count': (count: number) => void
  'oferta-status': (active: boolean) => void
  'new-leitura': (leitura: Leitura) => void
  'new-pedido': (pedido: Pedido) => void
  'error': (message: string) => void
  'user-status-change': (data: { userId: number; online: boolean }) => void
}

interface ClientToServerEvents {
  'join-live': (liveId: string) => void
  'leave-live': (liveId: string) => void
  'toggle-oferta': (data: { liveId: string; active: boolean }) => void
  'add-leitura': (data: { liveId: string; texto: string; minuto: string }) => void
  'pedido-oracao': (data: { liveId: string; para: string; motivo: string }) => void
  'user-connect': (userId: number) => void
  'user-disconnect': (userId: number) => void
}

export const socket = io<ServerToClientEvents, ClientToServerEvents>(
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
  {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 10000,
    transports: ['websocket', 'polling'],
    path: '/socket.io',
  }
)

let reconnectAttempts = 0

socket.on('connect', () => {
  console.log('Socket conectado! ID:', socket.id)
  reconnectAttempts = 0
})

socket.on('disconnect', (reason) => {
  console.log('Socket desconectado:', reason)
})

socket.on('connect_error', (error) => {
  console.error('Erro de conexão:', error)
  reconnectAttempts++
  if (reconnectAttempts > 5) {
    console.error('Máximo de tentativas de reconexão atingido')
    socket.disconnect()
  }
})

socket.on('error', (message) => {
  console.error('Erro do servidor:', message)
})

export default socket