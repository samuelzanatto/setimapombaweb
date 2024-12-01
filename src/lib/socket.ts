import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { prisma } from './prisma'

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer(server)

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id)

    socket.on('user-connect', async (userId: number) => {
      console.log('Usuário conectado:', userId)
      io.emit('user-status-change', { userId, online: true })
    })
  
    socket.on('user-disconnect', async (userId: number) => {
      console.log('Usuário desconectado:', userId)
      io.emit('user-status-change', { userId, online: false })
    })

    socket.on('join-live', async (liveId: string) => {
      socket.join(liveId)
      
      await prisma.viewerSession.create({
        data: {
          sessionId: socket.id,
          liveId: parseInt(liveId)
        }
      })

      // Atualizar contagem de viewers
      const viewerCount = await prisma.viewerSession.count({
        where: {
          liveId: parseInt(liveId),
          endedAt: null
        }
      })

      io.to(liveId).emit('viewer-count', viewerCount)
    })

    socket.on('toggle-oferta', async ({ liveId, active }) => {
      await prisma.live.update({
        where: { id: parseInt(liveId) },
        data: { ofertaAtiva: active }
      })

      io.to(liveId).emit('oferta-status', active)
    })

    socket.on('add-leitura', async ({ liveId, texto, minuto }) => {
      const newLeitura = await prisma.leitura.create({
        data: {
          liveId: parseInt(liveId),
          texto,
          minuto
        }
      })

      io.to(liveId).emit('new-leitura', newLeitura)
    })

    socket.on('pedido-oracao', async ({ liveId, para, motivo }) => {
      const newPedido = await prisma.pedidoOracao.create({
        data: {
          liveId: parseInt(liveId),
          para,
          motivo
        }
      })

      io.to(liveId).emit('new-pedido', newPedido)
    })

    socket.on('disconnect', async () => {
      await prisma.viewerSession.update({
        where: { sessionId: socket.id },
        data: { endedAt: new Date() }
      })
    })
  })

  return io
}