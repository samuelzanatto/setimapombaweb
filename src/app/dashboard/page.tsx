'use client'

import { useState, useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VideoPlayer } from '../components/VideoPlayer'

export default function DashboardPage({ params }: { params: { id: string } }) {
  const [currentLiveId, setCurrentLiveId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [embedError, setEmbedError] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [ofertaAtiva, setOfertaAtiva] = useState(false)
  const [leituras, setLeituras] = useState<any[]>([])
  const [pedidosOracao, setPedidosOracao] = useState<any[]>([])
  const [novoPedidoPara, setNovoPedidoPara] = useState('')
  const [novoPedidoMotivo, setNovoPedidoMotivo] = useState('')
  const [isLiveActive, setIsLiveActive] = useState(false)

  useEffect(() => {
    setIsLiveActive(!!currentLiveId)
  }, [currentLiveId])

  useEffect(() => {
    async function checkCurrentLive() {
      try {
        console.log('Iniciando chamada à API...')
        const response = await fetch('/api/lives/current')
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const responseText = await response.text()
        console.log('Resposta bruta:', responseText)
        
        if (!responseText) {
          console.log('Resposta vazia recebida')
          return
        }
      
        try {
          const data = JSON.parse(responseText)
          console.log('Dados parseados:', data)
          
          if (data.liveId) {
            setCurrentLiveId(data.liveId)
            setViewerCount(data.viewers || 0)
            setOfertaAtiva(data.ofertaAtiva || false)
            setLeituras(data.leituras || [])
            setPedidosOracao(data.pedidosOracao || [])
            setVideoType('live')
          }
        } catch (parseError) {
          console.error('Erro ao parsear JSON:', parseError)
          setCurrentLiveId(null)
        }
      } catch (error) {
        console.error('Erro ao buscar live atual:', error)
        setCurrentLiveId(null)
      } finally {
        setIsLoading(false)
      }
    }
  
    checkCurrentLive()
    const interval = setInterval(checkCurrentLive, 60000)
  
    return () => clearInterval(interval)
  }, [])

  const [videoId, setVideoId] = useState<string>('')
  const [videoType, setVideoType] = useState<'live' | 'video' | null>(null)

  const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID
  const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
  
  const checkVideoType = async (id: string) => {
    if (!id) return
    console.log('Verificando tipo:', id)

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${id}&key=${API_KEY}`
      )
      const data = await response.json()
      console.log('Resposta API:', data)
      
      if (data.items && data.items[0]) {
        const item = data.items[0]
        const isLive = item.snippet.liveBroadcastContent === 'live'
        console.log('Definindo tipo:', isLive ? 'live' : 'video') // Debug
        setVideoType(isLive ? 'live' : 'video')
      }
    } catch (error) {
      console.error('Erro ao verificar tipo do vídeo:', error)
      setVideoType(null)
    }
  }

  console.log('Estado atual:', { videoId, videoType })

  const CardOverlay = () => (
    <div className="absolute inset-0 flex rounded-xl items-center justify-center bg-black/5">
      <div className="bg-background/95 px-4 py-2 rounded-lg shadow-lg">
        <p className="text-sm font-medium">Não há transmissão no momento</p>
      </div>
    </div>
  )

  return (
    <div className="h-[93vh] flex flex-col">
      <main className="h-full overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-1 md:col-span-2">
            {isLoading ? (
              <div className="flex items-center justify-center aspect-video mb-4 border rounded-lg">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : currentLiveId ? (
              <div className='mb-4'>
                <VideoPlayer 
                  videoId={currentLiveId} 
                  isLive={true} 
                  onError={() => setEmbedError(true)}
                />
              </div>
            ) : (
              <div className="flex text-center aspect-video items-center mb-4 justify-center border rounded-lg">
                <h2 className="text-xl font-semibold">
                  Nenhuma transmissão ao vivo acontecendo no momento...
                </h2>
              </div>
            )}

            <div className='flex w-full h-52 gap-4 justify-between'>
            <Card className="relative w-full">
              <CardHeader>
                <CardTitle>
                  Pedidos de Oração
                </CardTitle>
              </CardHeader>
              <CardContent className={`${!isLiveActive ? 'blur-sm' : ''}`}>
                <div className="space-y-4">
                  <ul className="space-y-2">
                    {pedidosOracao.map(pedido => (
                      <li key={pedido.id} className="p-2 bg-muted rounded-lg">
                        <p className="font-semibold">Para: {pedido.para}</p>
                        <p className="text-sm text-muted-foreground">{pedido.motivo}</p>
                      </li>
                    ))}
                  </ul>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="">
                        Fazer Pedido de Oração
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Novo Pedido de Oração</DialogTitle>
                        <DialogDescription>
                          Compartilhe seu pedido de oração conosco.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <Input
                          value={novoPedidoPara}
                          onChange={(e) => setNovoPedidoPara(e.target.value)}
                          placeholder="Para quem é o pedido?"
                        />
                        <Input
                          value={novoPedidoMotivo}
                          onChange={(e) => setNovoPedidoMotivo(e.target.value)}
                          placeholder="Qual o motivo?"
                        />
                        <Button 
                          onClick={() => {
                            if (novoPedidoPara.trim() && novoPedidoMotivo.trim()) {
                              socket.emit('pedido-oracao', {
                                liveId: params.id,
                                para: novoPedidoPara,
                                motivo: novoPedidoMotivo
                              })
                              setNovoPedidoPara('')
                              setNovoPedidoMotivo('')
                            }
                          }}
                          className="w-full"
                        >
                          Enviar Pedido
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
              {!isLiveActive && <CardOverlay />}
            </Card>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="relative">
              <CardHeader>
                <CardTitle>Participantes Online</CardTitle>
              </CardHeader>
              <CardContent className={`${!isLiveActive ? 'blur-sm' : ''}`}>
                {viewerCount}
              </CardContent>
              {!isLiveActive && <CardOverlay />}
            </Card>

            <Card className='relative h-[30.1rem]'>
              <CardHeader>
                <CardTitle>Leituras Bíblicas</CardTitle>
              </CardHeader>
              <CardContent className={`${!isLiveActive ? 'blur-sm' : ''}`}>
                <ul className="space-y-2">
                  {leituras.map(leitura => (
                    <li key={leitura.id}>
                      {leitura.texto} - {leitura.minuto}
                    </li>
                  ))}
                </ul>
              </CardContent>
              {!isLiveActive && <CardOverlay />}
            </Card>

            <Card className="relative h-52">
              <CardHeader>
                <CardTitle>Ofertar</CardTitle>
              </CardHeader>
              <CardContent className={`${!ofertaAtiva ? 'blur-sm' : ''}`}>
                <div className="space-y-4">
                  <p>Chave PIX: igreja@exemplo.com</p>
                  <Button>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Fazer Oferta
                  </Button>
                </div>
              </CardContent>

              {!ofertaAtiva && (
                <div className="absolute inset-0 flex rounded-xl items-center justify-center bg-black/5">
                  <div className="bg-background/95 px-4 py-2 rounded-lg shadow-lg">
                    <p className="text-sm font-medium">Oferta não disponível no momento</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}