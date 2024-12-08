'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import {
  Select, SelectContent, SelectItem, 
  SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react"

const eventoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  dataHora: z.string().min(1, 'Data e hora são obrigatórios'),
  localId: z.number().min(1, 'Local é obrigatório'),
  cronograma: z.string().min(1, 'Cronograma é obrigatório'),
  status: z.enum(['agendado', 'em_andamento', 'concluido']).default('agendado')
})

type EventoForm = z.infer<typeof eventoSchema>

interface Evento {
  id: number
  titulo: string
  dataHora: string
  status: 'agendado' | 'em_andamento' | 'concluido'
  local: {
    id: number
    nome: string
  }
  cronograma: string
}

interface Local {
  id: number
  nome: string
}

export default function EventManager() {
  const { toast } = useToast()
  const [eventos, setEventos] = useState<Evento[]>([])
  const [locais, setLocais] = useState<Local[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<EventoForm>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      status: 'agendado'
    }
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [locaisRes, eventosRes] = await Promise.all([
        fetch('/api/locais'),
        fetch('/api/eventos')
      ])
      
      setLocais(locaisRes)
      setEventos(eventosRes)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar dados"
      })
    }
  }

  const onSubmit = async (data: EventoForm) => {
    try {
      setLoading(true)
      await fetch('/api/eventos', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      toast({
        title: "Sucesso",
        description: "Evento criado com sucesso"
      })

      setOpen(false)
      reset()
      fetchData()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao criar evento"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este evento?')) return

    try {
      await fetch(`/api/eventos/${id}`, {
        method: 'DELETE'
      })

      toast({
        title: "Sucesso",
        description: "Evento excluído com sucesso"
      })

      fetchData()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir evento"
      })
    }
  }

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Eventos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo Evento</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Evento</DialogTitle>
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
                <Label htmlFor="dataHora">Data e Hora</Label>
                <Input 
                  type="datetime-local" 
                  {...register('dataHora')}
                />
                {errors.dataHora && (
                  <p className="text-sm text-red-500">{errors.dataHora.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="localId">Local</Label>
                <Controller
                  name="localId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um local" />
                      </SelectTrigger>
                      <SelectContent>
                        {locais.map(local => (
                          <SelectItem key={local.id} value={local.id.toString()}>
                            {local.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.localId && (
                  <p className="text-sm text-red-500">{errors.localId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cronograma">Cronograma</Label>
                <Textarea {...register('cronograma')} />
                {errors.cronograma && (
                  <p className="text-sm text-red-500">{errors.cronograma.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Criar Evento"}
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
            <TableHead>Data/Hora</TableHead>
            <TableHead>Local</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {eventos.map((evento) => (
            <TableRow key={evento.id}>
              <TableCell>{evento.id}</TableCell>
              <TableCell>{evento.titulo}</TableCell>
              <TableCell>
                {new Date(evento.dataHora).toLocaleString('pt-BR')}
              </TableCell>
              <TableCell>{evento.local?.nome}</TableCell>
              <TableCell>
                <Badge variant={
                  evento.status === 'agendado' ? 'default' :
                  evento.status === 'em_andamento' ? 'secondary' : 
                  'success'
                }>
                  {evento.status === 'agendado' ? 'Agendado' :
                   evento.status === 'em_andamento' ? 'Em Andamento' : 
                   'Concluído'}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleDelete(evento.id)}>
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