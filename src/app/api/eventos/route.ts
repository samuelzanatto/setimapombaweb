import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const eventoSchema = z.object({
  titulo: z.string().min(3),
  dataHora: z.string().transform(str => new Date(str)),
  localId: z.number(),
  status: z.enum(['agendado', 'em_andamento', 'concluido']),
  cronograma: z.string()
})

export async function GET() {
  try {
    const eventos = await prisma.evento.findMany({
      include: {
        local: true
      }
  })
    return NextResponse.json(eventos)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar eventos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validatedData = eventoSchema.parse(data)
    const evento = await prisma.evento.create({ data: validatedData })
    return NextResponse.json(evento)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar evento' }, { status: 500 })
  }
}