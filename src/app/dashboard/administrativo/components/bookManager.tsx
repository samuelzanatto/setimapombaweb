'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from "@/hooks/use-toast"
import {
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, 
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

const mensagemSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  data: z.string().min(1, 'Data é obrigatória'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  pais: z.string().min(1, 'País é obrigatório'),
  traduzidoPor: z.string().optional(),
  conteudo: z.string().min(1, 'Conteúdo é obrigatório'),
  pdfUrl: z.string().optional()
})

type MensagemForm = z.infer<typeof mensagemSchema>

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

export default function BookManager() {
  const { toast } = useToast()
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [viewMessage, setViewMessage] = useState<Mensagem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const WORDS_PER_PAGE = 500
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base')

  const paginateContent = (content: string) => {
    // Divide o texto em parágrafos
    const paragraphs = content.split('\n').filter(p => p.trim())
    const pages = []
    let currentPage = []
    let wordCount = 0
    
    // Itera sobre os parágrafos
    for (const paragraph of paragraphs) {
      const paragraphWords = paragraph.split(' ').length
      
      // Se adicionar este parágrafo exceder o limite, cria nova página
      if (wordCount + paragraphWords > WORDS_PER_PAGE && currentPage.length > 0) {
        pages.push(currentPage.join('\n'))
        currentPage = []
        wordCount = 0
      }
      
      // Adiciona o parágrafo à página atual
      currentPage.push(paragraph)
      wordCount += paragraphWords
    }
    
    // Adiciona a última página se houver conteúdo
    if (currentPage.length > 0) {
      pages.push(currentPage.join('\n'))
    }
    
    return pages
  }

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MensagemForm>({
    resolver: zodResolver(mensagemSchema)
  })

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

  const onSubmit = async (data: MensagemForm) => {
    try {
      setLoading(true)
      await fetch('/api/mensagens', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      toast({
        title: "Sucesso",
        description: "Mensagem cadastrada com sucesso"
      })

      setOpen(false)
      reset()
      fetchMensagens()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao cadastrar mensagem"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta mensagem?')) return

    try {
      await fetch(`/api/mensagens/${id}`, {
        method: 'DELETE'
      })

      toast({
        title: "Sucesso",
        description: "Mensagem excluída com sucesso"
      })

      fetchMensagens()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir mensagem"
      })
    }
  }

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Mensagens</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nova Mensagem</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Mensagem</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input {...register('titulo')} />
                  {errors.titulo && (
                    <p className="text-sm text-red-500">{errors.titulo.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data">Data</Label>
                  <Input type="date" {...register('data')} />
                  {errors.data && (
                    <p className="text-sm text-red-500">{errors.data.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input {...register('cidade')} />
                  {errors.cidade && (
                    <p className="text-sm text-red-500">{errors.cidade.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Input {...register('estado')} />
                  {errors.estado && (
                    <p className="text-sm text-red-500">{errors.estado.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Input {...register('pais')} />
                  {errors.pais && (
                    <p className="text-sm text-red-500">{errors.pais.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traduzidoPor">Traduzido Por</Label>
                  <Input {...register('traduzidoPor')} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="conteudo">Conteúdo</Label>
                <Textarea 
                  {...register('conteudo')} 
                  className="min-h-[200px]"
                />
                {errors.conteudo && (
                  <p className="text-sm text-red-500">{errors.conteudo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdfUrl">URL do PDF</Label>
                <Input {...register('pdfUrl')} />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Cadastrar Mensagem"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={!!viewMessage} onOpenChange={() => {
          setViewMessage(null)
          setCurrentPage(1)
        }}>
          <DialogContent className="max-w-[1000px] h-[850px] p-8 flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <div className="flex items-center justify-between gap-4 py-2">
                <div className="flex-1">
                  <DialogTitle className="text-xl font-bold mb-2">{viewMessage?.titulo}</DialogTitle>
                  <div className="text-sm text-muted-foreground">
                    {viewMessage && new Date(viewMessage.data).toLocaleDateString('pt-BR')} - {viewMessage?.cidade}, {viewMessage?.estado}, {viewMessage?.pais}
                    {viewMessage?.traduzidoPor && (
                      <div>Traduzido por: {viewMessage.traduzidoPor}</div>
                    )}
                  </div>
                </div>

                <div className='flex flex-col gap-2'>
                  <p className='text-xs'>Tamanho da Fonte</p>
                  <Select 
                    value={fontSize} 
                    onValueChange={(value) => setFontSize(value as 'sm' | 'base' | 'lg')}
                  >
                    <SelectTrigger className="w-[180px]">
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
            
              <div className="flex-1 bg-white rounded-md p-8 overflow-auto">
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
              <div className="flex items-center justify-between pt-4 border-t mt-4">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Anterior
                </Button>
                
                <div className="text-sm font-medium">
                  Página {currentPage} de {paginateContent(viewMessage.conteudo).length}
                </div>
                
                <Button
                  variant="outline"
                  disabled={currentPage === paginateContent(viewMessage.conteudo).length}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Próxima
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>País</TableHead>
            <TableHead>Traduzido Por</TableHead>
            <TableHead>Ações</TableHead>
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
              <TableCell>{mensagem.id}</TableCell>
              <TableCell>{mensagem.titulo}</TableCell>
              <TableCell>
                {new Date(mensagem.data).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>{mensagem.cidade}</TableCell>
              <TableCell>{mensagem.estado}</TableCell>
              <TableCell>{mensagem.pais}</TableCell>
              <TableCell>{mensagem.traduzidoPor || '-'}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDelete(mensagem.id)}>
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}