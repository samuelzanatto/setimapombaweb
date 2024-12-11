'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Reuniao {
  id: number
  titulo: string
  dataHora: string
  status: 'agendado' | 'em_andamento' | 'concluido'
  local: {
    nome: string
  }
  responsavel: {
    name: string
  }
}

export default function ReunioesPage() {
  const router = useRouter()
  const [reunioes, setReunioes] = useState<Reuniao[]>([])

  useEffect(() => {
    const fetchReunioes = async () => {
      try {
        const response = await fetch('/api/reunioes')
        const data = await response.json()
        setReunioes(data)
      } catch (error) {
        console.error('Erro ao carregar reuniões:', error)
      }
    }
    fetchReunioes()
  }, [])

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Reuniões</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reunioes.map((reuniao) => (
          <Card 
            key={reuniao.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => router.push(`/dashboard/reunioes/${reuniao.id}`)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{reuniao.titulo}</CardTitle>
                <Badge variant={
                  reuniao.status === 'agendado' ? 'default' :
                  reuniao.status === 'em_andamento' ? 'secondary' : 
                  'success'
                }>
                  {reuniao.status === 'agendado' ? 'Agendada' :
                   reuniao.status === 'em_andamento' ? 'Em Andamento' : 
                   'Concluída'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {new Date(reuniao.dataHora).toLocaleString('pt-BR')}
                </p>
                <p className="text-sm">Local: {reuniao.local.nome}</p>
                <p className="text-sm">Responsável: {reuniao.responsavel.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        {reunioes.length === 0 && (
          <div className="col-span-full text-center py-6 text-muted-foreground">
            Nenhuma reunião encontrada
          </div>
        )}
      </div>
    </main>
  )
}