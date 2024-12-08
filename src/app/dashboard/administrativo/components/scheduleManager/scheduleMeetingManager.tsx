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

const reuniaoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  dataHora: z.string().min(1, 'Data e hora são obrigatórios'),
  localId: z.number().min(1, 'Local é obrigatório'),
  responsavelId: z.number().min(1, 'Responsável é obrigatório'),
  materiais: z.string().min(1, 'Materiais são obrigatórios'),
  cronograma: z.string().min(1, 'Cronograma é obrigatório'),
  informacoes: z.string().optional(),
  status: z.enum(['agendado', 'em_andamento', 'concluido']).default('agendado')
})

type ReuniaoForm = z.infer<typeof reuniaoSchema>

interface Reuniao {
  id: number
  titulo: string
  dataHora: string
  status: 'agendado' | 'em_andamento' | 'concluido'
  local: {
    id: number
    nome: string
  }
  responsavel: {
    id: number
    name: string
  }
  materiais: string
  cronograma: string
  informacoes?: string
}

interface Local {
  id: number
  nome: string
}

interface User {
  id: number
  name: string
}

export default function ScheduleMeetingManager() {
  const { toast } = useToast()
  const [reunioes, setReunioes] = useState<Reuniao[]>([])
  const [locais, setLocais] = useState<Local[]>([])
  const [responsaveis, setResponsaveis] = useState<User[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<ReuniaoForm>({
    resolver: zodResolver(reuniaoSchema),
    defaultValues: {
      status: 'agendado'
    }
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [locaisRes, usersRes, reunioesRes] = await Promise.all([
        fetch('/api/locais'),
        fetch('/api/users'),
        fetch('/api/reunioes')
      ])
      
      const [locais, users, reunioes] = await Promise.all([
        locaisRes.json(),
        usersRes.json(),
        reunioesRes.json()
      ])
      
      setLocais(locais)
      setResponsaveis(users)
      setReunioes(reunioes)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar dados"
      })
    }
  }

  const onSubmit = async (data: ReuniaoForm) => {
    try {
      setLoading(true)
      await fetch('/api/reunioes', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      toast({
        title: "Sucesso",
        description: "Reunião agendada com sucesso"
      })

      setOpen(false)
      reset()
      fetchData()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao agendar reunião"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir esta reunião?')) return

    try {
      await fetch(`/api/reunioes/${id}`, {
        method: 'DELETE'
      })

      toast({
        title: "Sucesso",
        description: "Reunião excluída com sucesso"
      })

      fetchData()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir reunião"
      })
    }
  }

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Reuniões</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Nova Reunião</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Nova Reunião</DialogTitle>
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
                <Label htmlFor="responsavelId">Responsável</Label>
                <Controller
                  name="responsavelId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um responsável" />
                      </SelectTrigger>
                      <SelectContent>
                        {responsaveis.map(resp => (
                          <SelectItem key={resp.id} value={resp.id.toString()}>
                            {resp.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.responsavelId && (
                  <p className="text-sm text-red-500">{errors.responsavelId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="materiais">Materiais Necessários</Label>
                <Textarea {...register('materiais')} />
                {errors.materiais && (
                  <p className="text-sm text-red-500">{errors.materiais.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cronograma">Cronograma</Label>
                <Textarea {...register('cronograma')} />
                {errors.cronograma && (
                  <p className="text-sm text-red-500">{errors.cronograma.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="informacoes">Informações Adicionais</Label>
                <Textarea {...register('informacoes')} />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : "Agendar Reunião"}
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
            <TableHead>Responsável</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reunioes.map((reuniao) => (
            <TableRow key={reuniao.id}>
              <TableCell>{reuniao.id}</TableCell>
              <TableCell>{reuniao.titulo}</TableCell>
              <TableCell>
                {new Date(reuniao.dataHora).toLocaleString('pt-BR')}
              </TableCell>
              <TableCell>{reuniao.local?.nome}</TableCell>
              <TableCell>{reuniao.responsavel?.name}</TableCell>
              <TableCell>
                <Badge variant={
                  reuniao.status === 'agendado' ? 'default' :
                  reuniao.status === 'em_andamento' ? 'secondary' : 
                  'success'
                }>
                  {reuniao.status === 'agendado' ? 'Agendada' :
                   reuniao.status === 'em_andamento' ? 'Em Andamento' : 
                   'Concluída'}
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
                    <DropdownMenuItem onClick={() => handleDelete(reuniao.id)}>
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