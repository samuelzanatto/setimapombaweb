'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

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
  materiais: string
  cronograma: string
  informacoes?: string
}

export default function ReuniaoDashboard() {
  const params = useParams()
  const [reuniao, setReuniao] = useState<Reuniao | null>(null)

  useEffect(() => {
    const fetchReuniao = async () => {
      try {
        const response = await fetch(`/api/reunioes/${params.id}`)
        const data = await response.json()
        setReuniao(data)
      } catch (error) {
        console.error('Erro ao carregar reunião:', error)
      }
    }
    fetchReuniao()
  }, [params.id])

  if (!reuniao) return <div>Carregando...</div>

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{reuniao.titulo}</h1>
          <p className="text-muted-foreground">
            {new Date(reuniao.dataHora).toLocaleString('pt-BR')}
          </p>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Informações Gerais</h2>
            <div className="space-y-2">
              <p><strong>Local:</strong> {reuniao.local.nome}</p>
              <p><strong>Responsável:</strong> {reuniao.responsavel.name}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Materiais Necessários</h2>
            <p className="whitespace-pre-line">{reuniao.materiais}</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Cronograma</h2>
            <p className="whitespace-pre-line">{reuniao.cronograma}</p>
          </CardContent>
        </Card>

        {reuniao.informacoes && (
          <Card className="md:col-span-2">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Informações Adicionais</h2>
              <p className="whitespace-pre-line">{reuniao.informacoes}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}