import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reuniaoSchema = z.object({
  titulo: z.string().min(3),
  dataHora: z.string().transform(str => new Date(str)),
  localId: z.number(),
  status: z.enum(['agendado', 'em_andamento', 'concluido']),
  responsavelId: z.number(),
  materiais: z.string(),
  cronograma: z.string(),
  informacoes: z.string().optional()
})

export async function GET() {
  try {
    const reunioes = await prisma.reuniao.findMany({
      include: {
        local: true,
        responsavel: true
      }
    })
    return NextResponse.json(reunioes)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar reuniões' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validatedData = reuniaoSchema.parse(data)
    const reuniao = await prisma.reuniao.create({ data: validatedData })
    return NextResponse.json(reuniao)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar reunião' }, { status: 500 })
  }
}