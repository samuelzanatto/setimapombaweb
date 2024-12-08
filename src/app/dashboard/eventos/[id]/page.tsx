
import { prisma } from '@/lib/prisma'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EventoDetalhesPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const evento = await prisma.evento.findUnique({
    where: { id: Number(params.id) },
    include: { local: true }
  })

  if (!evento) {
    notFound()
  }

  return (
    <main className="container mx-auto py-6">
      <div className="mb-6">
        <Link href="/dashboard/eventos">
          <Button variant="outline">← Voltar</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg p-6 border">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold">{evento.titulo}</h1>
          <Badge variant={
            evento.status === 'agendado' ? 'default' :
            evento.status === 'em_andamento' ? 'secondary' : 
            'success'
          }>
            {evento.status === 'agendado' ? 'Agendado' :
             evento.status === 'em_andamento' ? 'Em Andamento' : 
             'Concluído'}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Data e Hora</h2>
            <p>{new Date(evento.dataHora).toLocaleString('pt-BR')}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Local</h2>
            <p>{evento.local.nome}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Cronograma</h2>
            <p className="whitespace-pre-wrap">{evento.cronograma}</p>
          </div>
        </div>
      </div>
    </main>
  )
}