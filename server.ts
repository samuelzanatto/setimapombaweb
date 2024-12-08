import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import { Server } from 'socket.io'
import { initSocket } from './src/lib/socket'

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3001', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url!, true)
      handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('Internal server error')
    }
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

  initSocket(server)

  server.listen(port, () => {
    console.log(`> Servidor pronto em http://${hostname}:${port}`)
  })
})