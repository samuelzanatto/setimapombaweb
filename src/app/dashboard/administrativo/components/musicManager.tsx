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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

const hinoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  autor: z.string().min(1, 'Autor é obrigatório'),
  letra: z.string().min(1, 'Letra é obrigatória')
})

type HinoForm = z.infer<typeof hinoSchema>

interface Hino {
  id: number
  titulo: string
  autor: string
  letra: string
  createdAt: string
  updatedAt: string
}

export default function MusicManager() {
  const { toast } = useToast()
  const [hinos, setHinos] = useState<Hino[]>([])
  const [open, setOpen] = useState(false)
  const [viewHino, setViewHino] = useState<Hino | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<HinoForm>({
    resolver: zodResolver(hinoSchema)
  })

  useEffect(() => {
    fetchHinos()
  }, [])

  const fetchHinos = async () => {
    try {
      const response = await fetch('/api/hinos')
      const data = await response.json()
      setHinos(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar hinos"
      })
    }
  }

  const onSubmit = async (data: HinoForm) => {
    try {
      setLoading(true)
      await fetch('/api/hinos', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      toast({
        title: "Sucesso",
        description: "Hino cadastrado com sucesso"
      })

      setOpen(false)
      reset()
      fetchHinos()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao cadastrar hino"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este hino?')) return

    try {
      await fetch(`/api/hinos/${id}`, {
        method: 'DELETE'
      })

      toast({
        title: "Sucesso",
        description: "Hino excluído com sucesso"
      })

      fetchHinos()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir hino"
      })
    }
  }

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Hinos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo Hino</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Hino</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input {...register('titulo')} />
                {errors.titulo && (
                  <p className="text-sm text-red-500">{errors.titulo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="autor">Autor</Label>
                <Input {...register('autor')} />
                {errors.autor && (
                  <p className="text-sm text-red-500">{errors.autor.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="letra">Letra</Label>
                <Textarea 
                  {...register('letra')} 
                  className="min-h-[200px]"
                />
                {errors.letra && (
                  <p className="text-sm text-red-500">{errors.letra.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Cadastrar Hino"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Data Criação</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hinos.map((hino) => (
            <TableRow 
              key={hino.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setViewHino(hino)}
            >
              <TableCell>{hino.id}</TableCell>
              <TableCell>{hino.titulo}</TableCell>
              <TableCell>{hino.autor}</TableCell>
              <TableCell>
                {new Date(hino.createdAt).toLocaleDateString('pt-BR')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDelete(hino.id)}>
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!viewHino} onOpenChange={() => setViewHino(null)}>
        <DialogContent className="max-w-[600px] h-[800px] flex flex-col">
            <DialogHeader>
                <DialogTitle className="text-xl font-bold text-center">{viewHino?.titulo}</DialogTitle>
                    <div className="text-sm text-center text-muted-foreground">
                        Autor: {viewHino?.autor}
                    </div>
            </DialogHeader>

            <div className="flex-1 bg-white rounded-md text-center p-8 overflow-auto">
              <div className="prose max-w-none">
                {viewHino?.letra.split('\n\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-6 whitespace-pre-line">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}