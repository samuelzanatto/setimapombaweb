'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MoreVertical } from "lucide-react"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
const localSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  latitude: z.number(),
  longitude: z.number()
})

type LocalForm = z.infer<typeof localSchema>

interface Local {
  id: number
  nome: string
  latitude: number
  longitude: number
}

export default function LocalManager() {
  const { toast } = useToast()
  const [locais, setLocais] = useState<Local[]>([])
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingLocal, setEditingLocal] = useState<Local | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<LocalForm>({
    resolver: zodResolver(localSchema)
  })

  useEffect(() => {
    fetchLocais()
  }, [])

  const fetchLocais = async () => {
    try {
      const response = await fetch('/api/locais')
      const data = await response.json()
      setLocais(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao buscar locais"
      })
    }
  }

  const onSubmit = async (data: LocalForm) => {
    try {
      setLoading(true)
      const endpoint = editingLocal 
        ? `/api/locais/${editingLocal.id}`
        : '/api/locais'
      
      const method = editingLocal ? 'PUT' : 'POST'

      await fetch(endpoint, {
        method,
        body: JSON.stringify(data)
      })

      toast({
        title: "Sucesso",
        description: `Local ${editingLocal ? 'atualizado' : 'criado'} com sucesso`
      })

      setIsDialogOpen(false)
      reset()
      setEditingLocal(null)
      fetchLocais()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Erro ao ${editingLocal ? 'atualizar' : 'criar'} local`
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (local: Local) => {
    setEditingLocal(local)
    reset(local)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este local?')) return

    try {
      await fetch(`/api/locais/${id}`, {
        method: 'DELETE'
      })

      toast({
        title: "Sucesso",
        description: "Local excluído com sucesso"
      })

      fetchLocais()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir local"
      })
    }
  }

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Locais</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Novo Local</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLocal ? 'Editar Local' : 'Cadastrar Novo Local'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input {...register('nome')} />
                {errors.nome && (
                  <p className="text-sm text-red-500">{errors.nome.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input 
                  type="number" 
                  step="any"
                  {...register('latitude', { valueAsNumber: true })} 
                />
                {errors.latitude && (
                  <p className="text-sm text-red-500">{errors.latitude.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input 
                  type="number"
                  step="any" 
                  {...register('longitude', { valueAsNumber: true })} 
                />
                {errors.longitude && (
                  <p className="text-sm text-red-500">{errors.longitude.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Salvando..." : (editingLocal ? "Atualizar" : "Cadastrar")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locais.map((local) => (
            <TableRow key={local.id}>
              <TableCell>{local.id}</TableCell>
              <TableCell>{local.nome}</TableCell>
              <TableCell>{local.latitude}</TableCell>
              <TableCell>{local.longitude}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEdit(local)}>
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(local.id)}>
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