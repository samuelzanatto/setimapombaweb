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
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useAuth } from '@/hooks/useAuth'
import socket from '@/lib/socketClient'

const userSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido')
})

type UserForm = z.infer<typeof userSchema>

interface User {
  id: number
  username: string
  name: string | null
  email: string | null
  createdAt: string
  online?: boolean
}

export default function UsersManager() {
  const [users, setUsers] = useState<User[]>([])
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (user) {
      socket.emit('user-connect', user.id)
      
      return () => {
        socket.emit('user-disconnect', user.id)
      }
    }
  }, [user])

  useEffect(() => {
    socket.on('user-status-change', ({ userId, online }) => {
      setUsers(currentUsers => 
        currentUsers.map(u => 
          u.id === userId ? { ...u, online } : u
        )
      )
    })

    return () => {
      socket.off('user-status-change')
    }
  }, [])
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserForm>({
    resolver: zodResolver(userSchema)
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    }
  }

  const onSubmit = async (data: UserForm) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchUsers()
        setOpen(false)
        reset()
      }
    } catch (error) {
      console.error('Erro ao criar usuário:', error)
    }
  }

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuários do Sistema</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Novo Usuário</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input {...register('username')} />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input type="password" {...register('password')} />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
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
            <TableHead>Status</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Data de Cadastro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div 
                className={`w-3 h-3 rounded-full ${
                  user.online ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={user.online ? 'Online' : 'Offline'}
                />
              </TableCell>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                {format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  )
}