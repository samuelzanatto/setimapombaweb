import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { prisma } from './prisma'

export const initSocket = (server: NetServer) => {
  const io = new SocketIOServer(server)
  const onlineUsers = new Map<string, number>()

  io.on('connection', (socket) => {
    console.log('[Socket Server] Novo cliente conectado:', socket.id)

    socket.on('user-connect', async (userId: number) => {
      console.log('[Socket Server] Usuário conectando:', userId)
      onlineUsers.set(socket.id, userId)
      
      try {
        await prisma.user.update({
          where: { id: userId },
          data: { online: true }
        })
        
        // Emitir para todos os clientes o status atualizado
        io.emit('user-status-change', { userId, online: true })
        
        // Enviar lista de usuários online para o novo cliente
        const onlineUserIds = Array.from(new Set(onlineUsers.values()))
        onlineUserIds.forEach(id => {
          socket.emit('user-status-change', { userId: id, online: true })
        })
      } catch (error) {
        console.error('[Socket Server] Erro ao atualizar status:', error)
      }
    })
  
    socket.on('user-disconnect', async (userId: number) => {
      console.log('Usuário desconectado:', userId)
      onlineUsers.delete(socket.id)

      await prisma.user.update({
        where: { id: userId },
        data: { online: false }
      })

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
      const userId = onlineUsers.get(socket.id)
      if (userId) {
        console.log('[Socket Server] Usuário desconectado por timeout:', userId)
        onlineUsers.delete(socket.id)
        
        try {
          await prisma.user.update({
            where: { id: userId },
            data: { online: false }
          })
          console.log('[Socket Server] Status atualizado no DB para offline:', userId)
          
          io.emit('user-status-change', { userId, online: false })
          console.log('[Socket Server] Evento user-status-change emitido:', { userId, online: false })
        } catch (error) {
          console.error('[Socket Server] Erro ao atualizar status offline:', error)
        }
      }
    })
  })

  return io
}