'use client'

import { useState, useEffect, use } from 'react'
import { VideoPlayer } from '../../../components/VideoPlayer'
import { socket } from '@/lib/socketClient'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Heart, MessageCircle, Users } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface ViewerInfo {
  sessionId: string
  userName: string
  userImage?: string
}

export default function LivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [embedError, setEmbedError] = useState(false)
  const [viewers, setViewers] = useState<ViewerInfo[]>([])
  const [mensagens, setMensagens] = useState<any[]>([])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [user, setUser] = useState<any>(null)
  const [leituras, setLeituras] = useState<any[]>([])
  const [novaLeitura, setNovaLeitura] = useState('')
  const [minutoLeitura, setMinutoLeitura] = useState('')
  const [pedidosOracao, setPedidosOracao] = useState<any[]>([])

  useEffect(() => {
    socket.emit('join-live', id)

    socket.on('viewer-list', (viewerList) => {
      console.log('Viewers atualizados:', viewerList)
      setViewers(viewerList)
    })

    socket.on('new-message', (message) => {
      setMensagens((prev) => [...prev, message])
    })

    socket.on('new-pedido', (pedido) => {
      setPedidosOracao((prev) => [...prev, pedido])
    })

    return () => {
      socket.off('viewer-count')
      socket.off('new-message')
      socket.off('new-pedido')
    }
  }, [id])

  const toggleOferta = () => {
    const newStatus = !ofertaAtiva
    setOfertaAtiva(newStatus)
    socket.emit('toggle-oferta', { liveId: params.id, active: newStatus })
  }

  const addLeitura = (texto: string, minuto: string) => {
    socket.emit('add-leitura', { liveId: params.id, texto, minuto })
  }

  const handleEmbedError = () => {
    setEmbedError(true)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        {!embedError ? (
          <VideoPlayer 
            videoId={id} 
            isLive={true} 
            onError={handleEmbedError}
          />
        ) : (
          <div className="text-center p-8 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              Este vídeo não pode ser incorporado
            </h2>
            <p className="mb-4">
              O proprietário do vídeo desabilitou a reprodução em outros sites.
            </p>
            <Link 
              href={`https://www.youtube.com/watch?v=${params.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Assistir no YouTube
            </Link>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {/* Card de Participantes Online */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participantes Online ({viewers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {viewers.map((viewer) => (
                  <div key={viewer.sessionId} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted">
                    <Avatar>
                      <AvatarImage src={viewer.userImage || '/avatars/default.jpg'} />
                      <AvatarFallback>{viewer.userName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{viewer.userName}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
              
        {/* Card de Leituras Bíblicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Leituras Bíblicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {leituras.map((leitura, index) => (
                  <div key={index} className="p-2 bg-muted rounded-lg">
                    <p className="font-medium">{leitura.texto}</p>
                    <p className="text-sm text-muted-foreground">{leitura.minuto}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={(e) => {
              e.preventDefault()
              if (novaLeitura.trim() && minutoLeitura.trim()) {
                socket.emit('add-leitura', {
                  liveId: id,
                  texto: novaLeitura,
                  minuto: minutoLeitura
                })
                setNovaLeitura('')
                setMinutoLeitura('')
              }
            }} className="mt-4 space-y-2">
              <Input
                value={novaLeitura}
                onChange={(e) => setNovaLeitura(e.target.value)}
                placeholder="Digite a leitura..."
              />
              <Input
                value={minutoLeitura}
                onChange={(e) => setMinutoLeitura(e.target.value)}
                placeholder="Minuto da leitura..."
              />
              <Button type="submit" className="w-full">Adicionar Leitura</Button>
            </form>
          </CardContent>
        </Card>
          
        {/* Card de Pedidos de Oração */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Pedidos de Oração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {pedidosOracao.map((pedido, index) => (
                  <div key={index} className="p-2 bg-muted rounded-lg">
                    <p className="font-medium">Para: {pedido.para}</p>
                    <p className="text-sm">{pedido.motivo}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
              
        {/* Card do Chat ao Vivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat ao Vivo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {mensagens.map((msg, index) => (
                  <div key={index} className="p-2 bg-muted rounded-lg">
                    <p className="font-medium">{msg.usuario}</p>
                    <p className="text-sm">{msg.texto}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={(e) => {
              e.preventDefault()
              if (novaMensagem.trim()) {
                socket.emit('chat-message', {
                  liveId: id,
                  message: novaMensagem,
                  user: user?.name || 'Anônimo'
                })
                setNovaMensagem('')
              }
            }} className="mt-4 flex gap-2">
              <Input
                value={novaMensagem}
                onChange={(e) => setNovaMensagem(e.target.value)}
                placeholder="Digite sua mensagem..."
              />
              <Button type="submit">Enviar</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}