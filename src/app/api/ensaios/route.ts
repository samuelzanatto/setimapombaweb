import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const ensaioSchema = z.object({
  titulo: z.string().min(3),
  dataHora: z.string().transform(str => new Date(str)),
  localId: z.number(),
  status: z.enum(['agendado', 'em_andamento', 'concluido']),
  responsavelId: z.number()
})

export async function GET() {
  try {
    const ensaios = await prisma.ensaio.findMany({
      include: {
        local: true,
        responsavel: true
      }
    })
    return NextResponse.json(ensaios)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar ensaios' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validatedData = ensaioSchema.parse(data)
    const ensaio = await prisma.ensaio.create({ data: validatedData })
    return NextResponse.json(ensaio)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar ensaio' }, { status: 500 })
  }
}