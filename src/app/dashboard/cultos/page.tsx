'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Culto {
  id: number
  titulo: string
  dataInicio: string
  dataTermino: string
  status: string
  local: {
    nome: string
  }
  pastor: {
    name: string
  }
}

export default function CultosPage() {
  const [cultos, setCultos] = useState<Culto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCultos() {
      try {
        const response = await fetch('/api/cultos')
        const data = await response.json()
        setCultos(data)
      } catch (error) {
        console.error('Erro ao buscar cultos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCultos()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'bg-blue-400 text-blue-900 border-blue-900'
      case 'em_andamento': return 'bg-green-400 text-green-900 border-green-900'
      case 'concluido': return 'bg-gray-500 text-gray-900 border-gray-900'
      default: return 'bg-gray-500 text-gray-900 border-gray-900'
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <main className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cultos.map(culto => (
          <Link href={`/dashboard/cultos/${culto.id}`} key={culto.id}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{culto.titulo}</CardTitle>
                  <Badge className={getStatusColor(culto.status)}>
                    {culto.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(culto.dataInicio), "dd 'de' MMMM', às' HH:mm", { locale: ptBR })}
                  </p>
                  <p className="font-medium">{culto.local.nome}</p>
                  <p className="text-sm">Pastor: {culto.pastor.name}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  )
}