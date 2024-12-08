import { prisma } from '@/lib/prisma'
import { Badge } from "@/components/ui/badge"
import Link from 'next/link'

export default async function EventosPage() {
  const eventos = await prisma.evento.findMany({
    include: { local: true }
  })

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Eventos</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {eventos.map((evento) => (
          <Link 
            href={`/dashboard/eventos/${evento.id}`} 
            key={evento.id}
            className="block p-6 rounded-lg border hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-semibold">{evento.titulo}</h2>
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
            <p className="text-sm text-gray-500 mt-2">
              {new Date(evento.dataHora).toLocaleString('pt-BR')}
            </p>
            <p className="mt-1">{evento.local.nome}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}