
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Ensaio {
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

export default function EnsaioDashboard() {
  const params = useParams()
  const [ensaio, setEnsaio] = useState<Ensaio | null>(null)

  useEffect(() => {
    const fetchEnsaio = async () => {
      try {
        const response = await fetch(`/api/ensaios/${params.id}`)
        const data = await response.json()
        setEnsaio(data)
      } catch (error) {
        console.error('Erro ao carregar ensaio:', error)
      }
    }
    fetchEnsaio()
  }, [params.id])

  if (!ensaio) return <div>Carregando...</div>

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{ensaio.titulo}</h1>
          <p className="text-muted-foreground">
            {new Date(ensaio.dataHora).toLocaleString('pt-BR')}
          </p>
        </div>
        <Badge variant={
          ensaio.status === 'agendado' ? 'default' :
          ensaio.status === 'em_andamento' ? 'secondary' : 
          'success'
        }>
          {ensaio.status === 'agendado' ? 'Agendado' :
           ensaio.status === 'em_andamento' ? 'Em Andamento' : 
           'Concluído'}
        </Badge>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Informações Gerais</h2>
            <div className="space-y-2">
              <p><strong>Local:</strong> {ensaio.local.nome}</p>
              <p><strong>Responsável:</strong> {ensaio.responsavel.name}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}