'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreVertical } from "lucide-react"
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/hooks/use-toast'

// Atualizar o schema para tornar leituras obrigatório
const cultoSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  dataInicio: z.string().min(1, 'Data inicial é obrigatória'),
  dataTermino: z.string().min(1, 'Data final é obrigatória'),
  localId: z.number().min(1, 'Local é obrigatório'),
  pastorId: z.number().min(1, 'Pastor é obrigatório'),
  obreiroId: z.number().min(1, 'Obreiro é obrigatório'),
  liderCanticoId: z.number().min(1, 'Líder de cântico é obrigatório'),
  status: z.enum(['agendado', 'em_andamento', 'concluido']).default('agendado'),
  vocalIds: z.array(z.number()).optional().default([]),
  hinoIds: z.array(z.number()).optional().default([]),
  mensagemIds: z.array(z.number()).optional().default([]),
  leituras: z.array(z.object({
    livro: z.string(),
    capitulo: z.number(),
    versiculos: z.string()
  })).default([])
})

type CultoForm = z.infer<typeof cultoSchema>

interface Local {
  id: number
  nome: string
}

interface User {
  id: number
  name: string
}

export default function ScheduleServiceManager() {
    const { toast } = useToast()
    const [cultos, setCultos] = useState<any[]>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [locais, setLocais] = useState<Local[]>([])
    const [pastores, setPastores] = useState<User[]>([])
    const [obreiros, setObreiros] = useState<User[]>([])
    const [lideres, setLideres] = useState<User[]>([])
    const [step, setStep] = useState(1)
    const [vocalistas, setVocalistas] = useState<User[]>([])
    const [selectedVocais, setSelectedVocais] = useState<number[]>([])
    const [hinos, setHinos] = useState<any[]>([])
    const [selectedHinos, setSelectedHinos] = useState<number[]>([])
    const [mensagens, setMensagens] = useState<any[]>([])
    const [selectedMensagens, setSelectedMensagens] = useState<number[]>([])
    const [livrosBiblia, setLivrosBiblia] = useState<any[]>([])
    const [selectedLeituras, setSelectedLeituras] = useState<any[]>([])
    const [chapters, setChapters] = useState<number[]>([])
    const [versesPerReading, setVersesPerReading] = useState<Record<number, any[]>>({})

    const { control: serviceControl, register, handleSubmit, reset, formState: { errors } } = useForm<CultoForm>({
      resolver: zodResolver(cultoSchema),
      defaultValues: {
        status: 'agendado'
      }
    })

    useEffect(() => {
      async function fetchData() {
        try {
          const [
            locaisRes, 
            usersRes, 
            hinosRes, 
            mensagensRes,
            livrosResponse
          ] = await Promise.all([
            fetch('/api/locais'),
            fetch('/api/users'),
            fetch('/api/hinos'),
            fetch('/api/mensagens'),
            fetch('/api/bible/books')
          ])

          const livrosData = await livrosResponse.json()
          const locaisData = await locaisRes.json()
          const usersData = await usersRes.json()
          const hinosData = await hinosRes.json()
          const mensagensData = await mensagensRes.json()
          
          setLocais(locaisData)
          setPastores(usersData.filter((u: User) => u.cargo?.nome === 'Pastor'))
          setObreiros(usersData.filter((u: User) => u.cargo?.nome === 'Obreiro'))
          setLideres(usersData.filter((u: User) => u.cargo?.nome === 'Líder de Cântico'))
          setVocalistas(usersData.filter((u: User) => u.cargo?.nome === 'Vocalista'))
          setHinos(hinosData)
          setMensagens(mensagensData)
          setLivrosBiblia(livrosData)
        } catch (error) {
          console.error('Erro ao carregar dados:', error)
        }
      }
      
      fetchData()
    }, [])

    useEffect(() => {
      console.log('Livros:', livrosBiblia)
      console.log('Capítulos:', chapters)
    }, [livrosBiblia, chapters])

    const fetchCultos = async () => {
      try {
        const response = await fetch('/api/cultos')
        const data = await response.json()
        setCultos(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Erro ao carregar cultos"
        })
      }
    }

    useEffect(() => {
      fetchCultos()
    }, [])

    useEffect(() => {
      console.log('Leituras selecionadas:', selectedLeituras)
    }, [selectedLeituras])
  
    const onSubmit = async (data: CultoForm) => {
      try {
        setLoading(true)
        
        // Validar leituras antes do envio
        if (!selectedLeituras || selectedLeituras.length === 0) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Adicione pelo menos uma leitura bíblica"
          })
          setLoading(false)
          return
        }
    
        // Validar se todas as leituras estão completas
        const leiturasIncompletas = selectedLeituras.some(
          l => !l.livro || !l.capitulo || !l.versiculos
        )
    
        if (leiturasIncompletas) {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Complete todos os campos das leituras"
          })
          setLoading(false)
          return
        }
    
        // Preparar dados do formulário incluindo as leituras
        const formData = {
          ...data,
          vocalIds: selectedVocais,
          hinoIds: selectedHinos,
          mensagemIds: selectedMensagens,
          leituras: selectedLeituras.map(leitura => ({
            livro: leitura.livro,
            capitulo: Number(leitura.capitulo),
            versiculos: leitura.versiculos
          }))
        }
    
        console.log('Dados a serem enviados:', formData)
    
        const response = await fetch('/api/cultos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
    
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.message || 'Erro ao criar culto')
        }
    
        toast({
          title: "Sucesso",
          description: "Culto agendado com sucesso"
        })
    
        setOpen(false)
        reset()
        setStep(1)
        setSelectedVocais([])
        setSelectedHinos([])
        setSelectedMensagens([])
        setSelectedLeituras([])
        fetchCultos()
    
      } catch (error) {
        console.error('Erro ao enviar formulário:', error)
        toast({
          variant: "destructive",
          title: "Erro",
          description: error instanceof Error ? error.message : "Erro ao agendar culto"
        })
      } finally {
        setLoading(false)
      }
    }

    const loadChapters = async (book: string) => {
      try {
        const response = await fetch(`/api/bible/verses?book=${book}`)
        const data = await response.json()
        if (data.chapters) {
          // Criar array com números dos capítulos
          setChapters(Array.from({ length: data.chapters }, (_, i) => i + 1))
        }
      } catch (error) {
        console.error('Erro ao carregar capítulos:', error)
        setChapters([])
      }
    }
    
    const loadVerses = async (book: string, chapter: number, index: number) => {
      try {
        const response = await fetch(`/api/bible/verses?book=${book}&chapter=${chapter}`)
        const data = await response.json()
        if (data.verses) {
          setVersesPerReading(prev => ({
            ...prev,
            [index]: data.verses
          }))
        }
      } catch (error) {
        console.error('Erro ao carregar versículos:', error)
        setVersesPerReading(prev => ({
          ...prev,
          [index]: []
        }))
      }
    }

    return (
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gerenciar Cultos</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Novo Culto</Button>
              </DialogTrigger>
              <DialogContent className="max-w-[800px]">
                <DialogHeader>
                  <DialogTitle>Agendar Novo Culto - Passo {step} de 5</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {step === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="titulo">Título</Label>
                        <Input {...register('titulo')} />
                        {errors.titulo && (
                          <p className="text-sm text-red-500">{errors.titulo.message as string}</p>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dataInicio">Data Início</Label>
                          <Input type="datetime-local" {...register('dataInicio')} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dataTermino">Data Término</Label>
                          <Input type="datetime-local" {...register('dataTermino')} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="localId">Local</Label>
                        <Controller
                          name="localId"
                          control={serviceControl}
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
                        <Label htmlFor="pastorId">Pastor Responsável</Label>
                        <Controller
                          name="pastorId"
                          control={serviceControl}
                          render={({ field }) => (
                            <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um pastor" />
                              </SelectTrigger>
                              <SelectContent>
                                {pastores.map(pastor => (
                                  <SelectItem key={pastor.id} value={pastor.id.toString()}>
                                    {pastor.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.pastorId && (
                          <p className="text-sm text-red-500">{errors.pastorId.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="obreiroId">Obreiro Responsável</Label>
                        <Controller
                          name="obreiroId"
                          control={serviceControl}
                          render={({ field }) => (
                            <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um obreiro" />
                              </SelectTrigger>
                              <SelectContent>
                                {obreiros.map(obreiro => (
                                  <SelectItem key={obreiro.id} value={obreiro.id.toString()}>
                                    {obreiro.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.obreiroId && (
                          <p className="text-sm text-red-500">{errors.obreiroId.message}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="liderCanticoId">Líder de Cântico</Label>
                        <Controller
                          name="liderCanticoId"
                          control={serviceControl}
                          render={({ field }) => (
                            <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um líder" />
                              </SelectTrigger>
                              <SelectContent>
                                {lideres.map(lider => (
                                  <SelectItem key={lider.id} value={lider.id.toString()}>
                                    {lider.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors.liderCanticoId && (
                          <p className="text-sm text-red-500">{errors.liderCanticoId.message}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Selecione os Vocalistas</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {vocalistas.map(vocal => (
                          <div key={vocal.id} className="flex items-center space-x-2">
                            <Checkbox 
                              checked={selectedVocais.includes(vocal.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedVocais([...selectedVocais, vocal.id])
                                } else {
                                  setSelectedVocais(selectedVocais.filter(id => id !== vocal.id))
                                }
                              }}
                            />
                            <label>{vocal.name}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Selecione os Hinos</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {hinos.map(hino => (
                          <div key={hino.id} className="flex items-center space-x-2">
                            <Checkbox 
                              checked={selectedHinos.includes(hino.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedHinos([...selectedHinos, hino.id])
                                } else {
                                  setSelectedHinos(selectedHinos.filter(id => id !== hino.id))
                                }
                              }}
                            />
                            <label>{hino.titulo}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Selecione as Mensagens</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {mensagens.map(mensagem => (
                          <div key={mensagem.id} className="flex items-center space-x-2">
                            <Checkbox 
                              checked={selectedMensagens.includes(mensagem.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedMensagens([...selectedMensagens, mensagem.id])
                                } else {
                                  setSelectedMensagens(selectedMensagens.filter(id => id !== mensagem.id))
                                }
                              }}
                            />
                            <label>{mensagem.titulo}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Adicionar Leituras Bíblicas</h3>
                      <div className="space-y-4">
                        {selectedLeituras.map((leitura, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Select 
                              value={leitura.livro} 
                              onValueChange={(value) => {
                                const newLeituras = [...selectedLeituras]
                                newLeituras[index] = {
                                  ...newLeituras[index],
                                  livro: value,
                                  capitulo: undefined,
                                  versiculos: undefined
                                }
                                setSelectedLeituras(newLeituras)
                                loadChapters(value)
                                // Limpar os versículos quando trocar o livro
                                setVersesPerReading(prev => ({
                                  ...prev,
                                  [index]: []
                                }))
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o livro" />
                              </SelectTrigger>
                              <SelectContent>
                                {livrosBiblia && livrosBiblia.map((livro: any) => (
                                  <SelectItem 
                                    key={livro.abbrev.pt} 
                                    value={livro.abbrev.pt}
                                  >
                                    {livro.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
          
                            <Select 
                              value={leitura.capitulo?.toString()}
                              onValueChange={(value) => {
                                const newLeituras = [...selectedLeituras]
                                newLeituras[index] = {
                                  ...newLeituras[index],
                                  capitulo: Number(value)
                                }
                                setSelectedLeituras(newLeituras)
                                loadVerses(leitura.livro, Number(value), index)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Capítulo" />
                              </SelectTrigger>
                              <SelectContent>
                                {chapters.map((chapter) => (
                                  <SelectItem key={chapter} value={chapter.toString()}>
                                    {chapter}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
          
                            <Select
                              value={leitura.versiculos}
                              onValueChange={(value) => {
                                const newLeituras = [...selectedLeituras]
                                newLeituras[index].versiculos = value
                                setSelectedLeituras(newLeituras)
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Versículos" />
                              </SelectTrigger>
                              <SelectContent>
                                {versesPerReading[index]?.length > 0 ? (
                                  versesPerReading[index].map((verse: any) => (
                                    <SelectItem key={verse.number} value={verse.number.toString()}>
                                      {verse.number}: {verse.text.substring(0, 30)}...
                                    </SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="placeholder" disabled>
                                    Selecione um capítulo primeiro
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
          
                            <Button
                              variant="destructive"
                              onClick={() => {
                                setSelectedLeituras(selectedLeituras.filter((_, i) => i !== index))
                              }}
                            >
                              Remover
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          onClick={() => {
                            setSelectedLeituras([
                              ...selectedLeituras,
                              { livro: '', capitulo: 1, versiculos: '' }
                            ])
                          }}
                        >
                          Adicionar Leitura
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(Math.max(1, step - 1))}
                      disabled={step === 1}
                    >
                      Anterior
                    </Button>

                    {step < 5 ? (
                      <Button
                        type="button"
                        onClick={() => setStep(Math.min(5, step + 1))}
                      >
                        Próximo
                      </Button>
                    ) : (
                      <Button 
                        type="submit"
                        disabled={loading}
                        onClick={handleSubmit(onSubmit)}
                      >
                        {loading ? "Salvando..." : "Finalizar"}
                      </Button>
                    )}
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Data Início</TableHead>
                <TableHead>Data Término</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Pastor</TableHead>
                <TableHead>Obreiro</TableHead>
                <TableHead>Líder de Cântico</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {cultos.map((culto) => (
              <TableRow key={culto.id}>
                <TableCell>{culto.id}</TableCell>
                <TableCell>{culto.titulo}</TableCell>
                <TableCell>
                  {new Date(culto.dataInicio).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell>
                  {new Date(culto.dataTermino).toLocaleString('pt-BR')}
                </TableCell>
                <TableCell>{culto.local?.nome}</TableCell>
                <TableCell>{culto.pastor?.name}</TableCell>
                <TableCell>{culto.obreiro?.name}</TableCell>
                <TableCell>{culto.liderCantico?.name}</TableCell>
                <TableCell>
                  <Badge variant={
                    culto.status === 'agendado' ? 'default' :
                    culto.status === 'em_andamento' ? 'secondary' : 
                    'default'
                  }>
                    {culto.status === 'agendado' ? 'Agendado' :
                     culto.status === 'em_andamento' ? 'Em Andamento' : 
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
                      <DropdownMenuItem>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600"
                        onClick={ async () => {
                          if (confirm('Deseja realmente excluir este culto?')) {
                            try {
                              await fetch(`/api/cultos/${culto.id}`, {
                                method: 'DELETE'
                              })
                              toast({
                                title: "Sucesso",
                                description: "Culto excluído com sucesso"
                              })
                              fetchCultos()
                            } catch (error) {
                              toast({
                                variant: "destructive",
                                title: "Erro",
                                description: "Erro ao excluir culto"
                              })
                            }
                          }
                        }}>
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