'use client'

import { useState, useEffect } from 'react'
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Mensagem {
  id: number
  titulo: string
  data: string
  cidade: string
  estado: string
  pais: string
  traduzidoPor?: string
  conteudo: string
  pdfUrl?: string
}

export default function MensagensPage() {
  const { toast } = useToast()
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [viewMessage, setViewMessage] = useState<Mensagem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base')
  const WORDS_PER_PAGE = 500

  const paginateContent = (content: string) => {
    const paragraphs = content.split('\n').filter(p => p.trim())
    const pages = []
    let currentPage = []
    let wordCount = 0
    
    for (const paragraph of paragraphs) {
      const paragraphWords = paragraph.split(' ').length
      
      if (wordCount + paragraphWords > WORDS_PER_PAGE && currentPage.length > 0) {
        pages.push(currentPage.join('\n'))
        currentPage = []
        wordCount = 0
      }
      
      currentPage.push(paragraph)
      wordCount += paragraphWords
    }
    
    if (currentPage.length > 0) {
      pages.push(currentPage.join('\n'))
    }
    
    return pages
  }

  useEffect(() => {
    fetchMensagens()
  }, [])

  const fetchMensagens = async () => {
    try {
      const response = await fetch('/api/mensagens')
      const data = await response.json()
      setMensagens(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar mensagens"
      })
    }
  }

  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Mensagens</h1>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Título</TableHead>
              <TableHead className="min-w-[100px]">Data</TableHead>
              <TableHead className="min-w-[100px]">Cidade</TableHead>
              <TableHead className="min-w-[80px]">Estado</TableHead>
              <TableHead className="min-w-[80px]">País</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mensagens.map((mensagem) => (
              <TableRow 
                key={mensagem.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  setViewMessage(mensagem)
                  setCurrentPage(1)
                }}
              >
                <TableCell>{mensagem.titulo}</TableCell>
                <TableCell>
                  {new Date(mensagem.data).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>{mensagem.cidade}</TableCell>
                <TableCell>{mensagem.estado}</TableCell>
                <TableCell>{mensagem.pais}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewMessage} onOpenChange={() => {
        setViewMessage(null)
        setCurrentPage(1)
      }}>
        <DialogContent className="max-w-[1000px] w-full max-h-[90vh] md:h-[850px] p-4 md:p-8 flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-lg md:text-xl font-bold mb-2">{viewMessage?.titulo}</DialogTitle>
                <div className="text-xs md:text-sm text-muted-foreground">
                  {viewMessage && new Date(viewMessage.data).toLocaleDateString('pt-BR')} - {viewMessage?.cidade}, {viewMessage?.estado}, {viewMessage?.pais}
                  {viewMessage?.traduzidoPor && (
                    <div>Traduzido por: {viewMessage.traduzidoPor}</div>
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-1'>
                <p className='text-xs'>Tamanho da Fonte</p>
                <Select 
                  value={fontSize} 
                  onValueChange={(value) => setFontSize(value as 'sm' | 'base' | 'lg')}
                >
                  <SelectTrigger className="w-full md:w-[180px] h-8 text-xs">
                    <SelectValue placeholder="Tamanho do texto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Pequeno</SelectItem>
                    <SelectItem value="base">Médio</SelectItem>
                    <SelectItem value="lg">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 bg-white rounded-md p-3 md:p-8 overflow-y-auto my-2">
            <div className={`prose max-w-none ${
              fontSize === 'sm' ? 'prose-sm' : 
              fontSize === 'lg' ? 'prose-lg' : 
              'prose-base'
            }`}>
              {viewMessage && paginateContent(viewMessage.conteudo)[currentPage - 1].split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className={`mb-4 text-${fontSize}`}>
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>
          
          {viewMessage && (
            <div className="flex items-center justify-between border-t pt-2 mt-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="text-xs h-8"
              >
                Anterior
              </Button>
              
              <div className="text-xs font-medium">
                {currentPage}/{paginateContent(viewMessage.conteudo).length}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === paginateContent(viewMessage.conteudo).length}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="text-xs h-8"
              >
                Próxima
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}