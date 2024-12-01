import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const port = process.env.PORT || 3001

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  })

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  })

  // Socket.IO handlers
  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id)

    socket.on('join-live', (liveId) => {
      socket.join(liveId)
      // Emitir contagem de viewers
      const roomSize = io.sockets.adapter.rooms.get(liveId)?.size || 0
      io.to(liveId).emit('viewer-count', roomSize)
    })

    socket.on('disconnect', () => {
      console.log('Cliente desconectado:', socket.id)
    })
  })

  server.listen(port, () => {
    console.log(`> Servidor pronto na porta ${port}`)
  })
})