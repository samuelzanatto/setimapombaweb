'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/hooks/use-toast'
const cargoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres')
})

type CargoForm = z.infer<typeof cargoSchema>

interface Cargo {
  id: number
  nome: string
}

export default function RoleManager() {
  const { toast } = useToast()
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [open, setOpen] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CargoForm>({
    resolver: zodResolver(cargoSchema)
  })

  useEffect(() => {
    fetchCargos()
  }, [])

  const fetchCargos = async () => {
    try {
      const response = await fetch('/api/cargos')
      const data = await response.json()
      setCargos(data)
    } catch (error) {
      console.error('Erro ao buscar cargos:', error)
    }
  }

  const onSubmit = async (data: CargoForm) => {
    try {
      await fetch('/api/cargos', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      toast({
        title: 'Sucesso',
        description: 'Cargo criado com sucesso'
      })
      
      fetchCargos()
      setOpen(false)
      reset()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao criar cargo'
      })
    }
  }

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gerenciar Cargos</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo Cargo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cargo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Cargo</Label>
                <Input {...register('nome')} />
                {errors.nome && (
                  <p className="text-sm text-red-500">{errors.nome.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full">Cadastrar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cargos.map((cargo) => (
            <TableRow key={cargo.id}>
              <TableCell>{cargo.id}</TableCell>
              <TableCell>{cargo.nome}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    try {
                      await fetchWithAuth(`/api/cargos/${cargo.id}`, {
                        method: 'DELETE'
                      })
                      fetchCargos()
                      toast({
                        title: 'Sucesso',
                        description: 'Cargo removido com sucesso'
                      })
                    } catch (error) {
                      toast({
                        variant: 'destructive',
                        title: 'Erro',
                        description: 'Erro ao remover cargo'
                      })
                    }
                  }}
                >
                  Remover
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}