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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreVertical } from "lucide-react"
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const userEditSchema = z.object({
  username: z.string().min(3, 'Mínimo 3 caracteres'),
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cargoId: z.number().min(1, 'Cargo é obrigatório')
})

const userCreateSchema = userEditSchema.extend({
  password: z.string().min(6, 'Mínimo 6 caracteres')
})

const passwordChangeSchema = z.object({
  password: z.string().min(6, 'Mínimo 6 caracteres')
})

type UserEditForm = z.infer<typeof userEditSchema>
type UserCreateForm = z.infer<typeof userCreateSchema>
type PasswordChangeForm = z.infer<typeof passwordChangeSchema>

interface User {
  id: number
  username: string
  name: string | null
  email: string | null
  createdAt: string
  cargo?: {
    id: number
    nome: string
  }
  online?: boolean
}

interface Cargo {
  id: number
  nome: string
}

export default function UserManager() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [cargos, setCargos] = useState<Cargo[]>([])
  const [createUserOpen, setCreateUserOpen] = useState(false)
  const [editUserOpen, setEditUserOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  
  // Create User Form
  const {
    control: createControl,
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors }
  } = useForm<UserCreateForm>({
    resolver: zodResolver(userCreateSchema)
  })

  // Edit User Form
  const {
    control: editControl,
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    formState: { errors: editErrors }
  } = useForm<UserEditForm>({
    resolver: zodResolver(userEditSchema)
  })

  // Change Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors }
  } = useForm<PasswordChangeForm>({
    resolver: zodResolver(passwordChangeSchema)
  })

  useEffect(() => {
    fetchUsers()
    fetchCargos()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      const data = await response.json()
      console.log('[Client] Usuários carregados:', 
        data.map(u => ({id: u.id, online: u.online}))
      )
      setUsers(data)
    } catch (error) {
      console.error('[Client] Erro ao buscar usuários:', error)
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao buscar usuários"
      })
    }
  }

  const fetchCargos = async () => {
    try {
      const response = await fetch('/api/cargos')
      const data = await response.json()
      setCargos(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao buscar cargos"
      })
    }
  }

  const onCreateUser = async (data: UserCreateForm) => {
    try {
      setLoading(true)
      await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data)
      })

      toast({
        title: "Sucesso",
        description: "Usuário criado com sucesso"
      })

      fetchUsers()
      setCreateUserOpen(false)
      resetCreate()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao criar usuário"
      })
    } finally {
      setLoading(false)
    }
  }

  const onEditUser = async (data: UserEditForm) => {
    if (!currentUser) return

    try {
      setLoading(true)
      await fetch(`/api/users/${currentUser.id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      })

      toast({
        title: "Sucesso",
        description: "Usuário atualizado com sucesso"
      })

      fetchUsers()
      setEditUserOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar usuário"
      })
    } finally {
      setLoading(false)
    }
  }

  const onChangePassword = async (data: PasswordChangeForm) => {
    if (!currentUser) return

    try {
      setLoading(true)
      await fetch(`/api/users/${currentUser.id}/password`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      })

      toast({
        title: "Sucesso",
        description: "Senha atualizada com sucesso"
      })

      setChangePasswordOpen(false)
      setEditUserOpen(true)
      resetPassword()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao atualizar senha"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditUser = (user: User) => {
    setCurrentUser(user)
    resetEdit({
      username: user.username,
      name: user.name || '',
      email: user.email || '',
      cargoId: user.cargo?.id
    })
    setEditUserOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja realmente excluir este usuário?')) return

    try {
      await fetch(`/api/users/${id}`, {
        method: 'DELETE'
      })

      toast({
        title: "Sucesso",
        description: "Usuário excluído com sucesso"
      })

      fetchUsers()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao excluir usuário"
      })
    }
  }

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuários do Sistema</h1>
        <Dialog open={createUserOpen} onOpenChange={setCreateUserOpen}>
          <DialogTrigger asChild>
            <Button>Novo Usuário</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateSubmit(onCreateUser)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <Input {...registerCreate('username')} />
                {createErrors.username && (
                  <p className="text-sm text-red-500">{createErrors.username.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input type="password" {...registerCreate('password')} />
                {createErrors.password && (
                  <p className="text-sm text-red-500">{createErrors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input {...registerCreate('name')} />
                {createErrors.name && (
                  <p className="text-sm text-red-500">{createErrors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input type="email" {...registerCreate('email')} />
                {createErrors.email && (
                  <p className="text-sm text-red-500">{createErrors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cargoId">Cargo</Label>
                <Controller
                  name="cargoId"
                  control={createControl}
                  render={({ field }) => (
                    <Select 
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={field.value?.toString()}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        {cargos.map(cargo => (
                          <SelectItem key={cargo.id} value={cargo.id.toString()}>
                            {cargo.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {createErrors.cargoId && (
                  <p className="text-sm text-red-500">{createErrors.cargoId.message}</p>
                )}
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editUserOpen} onOpenChange={setEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit(onEditUser)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input {...registerEdit('username')} />
              {editErrors.username && (
                <p className="text-sm text-red-500">{editErrors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="flex items-center space-x-2">
                <Input 
                  type="password" 
                  value="********" 
                  disabled 
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setEditUserOpen(false)
                    setChangePasswordOpen(true)
                  }}
                >
                  Alterar Senha
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input {...registerEdit('name')} />
              {editErrors.name && (
                <p className="text-sm text-red-500">{editErrors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input type="email" {...registerEdit('email')} />
              {editErrors.email && (
                <p className="text-sm text-red-500">{editErrors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cargoId">Cargo</Label>
              <Controller
                name="cargoId"
                control={editControl}
                render={({ field }) => (
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      {cargos.map(cargo => (
                        <SelectItem key={cargo.id} value={cargo.id.toString()}>
                          {cargo.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {editErrors.cargoId && (
                <p className="text-sm text-red-500">{editErrors.cargoId.message}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <Input type="password" {...registerPassword('password')} />
              {passwordErrors.password && (
                <p className="text-sm text-red-500"
                >{passwordErrors.password.message}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Usuário</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>
                <div 
                className={`w-3 h-3 rounded-full ${
                  user.online ? 'bg-green-500' : 'bg-red-500'
                }`}
                title={user.online ? 'Online' : 'Offline'}
                />
              </TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.cargo?.nome || 'Sem cargo'}</TableCell>
              <TableCell>
                {format(new Date(user.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreVertical className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                      Editar usuário
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(user.id)}>
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