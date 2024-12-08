'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Culto {
  id: number
  titulo: string
  dataInicio: string
  dataTermino: string
  status: 'agendado' | 'em_andamento' | 'concluido'
  local: {
    id: number
    nome: string
  }
  pastor: {
    id: number
    name: string
  }
  obreiro: {
    id: number
    name: string
  }
  liderCantico: {
    id: number
    name: string
  }
  vocal: {
    id: number
    name: string
  }[]
  hinos: {
    id: number
    titulo: string
    autor: string
  }[]
  mensagens: {
    id: number
    titulo: string
    autor: string
  }[]
  leituras: {
    id: number
    livro: string
    capitulo: number
    versiculos: string
  }[]
}

export default function CultoDashboard() {
  const params = useParams()
  const [culto, setCulto] = useState<Culto | null>(null)
  const [livrosBiblia, setLivrosBiblia] = useState<any[]>([])

  useEffect(() => {
    const fetchCulto = async () => {
      try {
        const response = await fetch(`/api/cultos/${params.id}`)
        const data = await response.json()
        setCulto(data)
      } catch (error) {
        console.error('Erro ao carregar culto:', error)
      }
    }
    fetchCulto()
  }, [params.id])

  useEffect(() => {
    const fetchBibleBooks = async () => {
      try {
        const response = await fetch('/api/bible/books')
        const data = await response.json()
        setLivrosBiblia(data)
      } catch (error) {
        console.error('Erro ao carregar livros:', error)
      }
    }
    fetchBibleBooks()
  }, [])

  if (!culto) return <div>Carregando...</div>

  const getNomeLivro = (abbrev: string) => {
    const livro = livrosBiblia.find(l => l.abbrev.pt === abbrev)
    return livro ? livro.name : abbrev
  }

  return (
    <main className="container mx-auto py-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{culto.titulo}</h1>
          <div className="text-muted-foreground">
            <p>
              {format(new Date(culto.dataInicio), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
            </p>
            <p>
              Duração prevista: {format(new Date(culto.dataTermino), "HH:mm")}
            </p>
          </div>
        </div>
        <Badge variant={
          culto.status === 'agendado' ? 'default' :
          culto.status === 'em_andamento' ? 'secondary' : 
          'success'
        }>
          {culto.status === 'agendado' ? 'Agendado' :
           culto.status === 'em_andamento' ? 'Em Andamento' : 
           'Concluído'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Informações Gerais</h2>
            <div className="space-y-2">
              <p><strong>Local:</strong> {culto.local.nome}</p>
              <p><strong>Pastor:</strong> {culto.pastor.name}</p>
              <p><strong>Obreiro:</strong> {culto.obreiro.name}</p>
              <p><strong>Líder de Louvor:</strong> {culto.liderCantico.name}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Vocal</h2>
            <ul className="list-disc list-inside space-y-1">
              {culto.vocal.map(membro => (
                <li key={membro.id}>{membro.name}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Hinos</h2>
            <ul className="list-disc list-inside space-y-1">
              {culto.hinos.map(hino => (
                <li key={hino.id}>
                  {hino.titulo} - <span className="text-muted-foreground">{hino.autor}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Mensagens</h2>
            <ul className="list-disc list-inside space-y-1">
              {culto.mensagens.map(mensagem => (
                <li key={mensagem.id}>
                  {mensagem.titulo}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Leituras Bíblicas</h2>
            <ul className="list-disc list-inside space-y-2">
              {culto.leituras?.map(leitura => (
                <li key={leitura.id} className='list-none'>
                  <p className="font-medium">
                    - {getNomeLivro(leitura.livro)} {leitura.capitulo}:{leitura.versiculos}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}