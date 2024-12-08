'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

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

export default function EnsaiosPage() {
  const [ensaios, setEnsaios] = useState<Ensaio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEnsaios = async () => {
      try {
        const response = await fetch('/api/ensaios')
        if (!response.ok) throw new Error('Falha ao carregar ensaios')
        const data = await response.json()
        setEnsaios(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar ensaios')
      } finally {
        setLoading(false)
      }
    }

    fetchEnsaios()
  }, [])

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro: {error}</div>

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ensaios</h1>
        <Button asChild>
          <Link href="/dashboard/ensaios/novo">
            <PlusIcon className="w-4 h-4 mr-2" />
            Novo Ensaio
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {ensaios.map((ensaio) => (
          <Link 
            key={ensaio.id} 
            href={`/dashboard/ensaios/${ensaio.id}`}
            className="block"
          >
            <div className="border rounded-lg p-4 hover:bg-muted transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{ensaio.titulo}</h2>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ensaio.dataHora).toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Local: {ensaio.local.nome}
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
            </div>
          </Link>
        ))}
        
        {ensaios.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            Nenhum ensaio encontrado
          </div>
        )}
      </div>
    </main>
  )
}