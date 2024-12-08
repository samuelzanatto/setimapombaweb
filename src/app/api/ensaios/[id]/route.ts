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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const validatedData = ensaioSchema.parse(data)
    
    const item = await prisma.ensaio.update({
      where: { id: Number(params.id) },
      data: validatedData
    })
    
    return NextResponse.json(item)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.ensaio.delete({
      where: { id: Number(params.id) }
    })
    return NextResponse.json({ message: 'Deletado com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 })
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const ensaio = await prisma.ensaio.findUnique({
      where: { id: Number(params.id) },
      include: {
        local: true,
        responsavel: true
      }
    })
    
    if (!ensaio) {
      return NextResponse.json({ error: 'Ensaio não encontrado' }, { status: 404 })
    }

    return NextResponse.json(ensaio)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar ensaio' }, { status: 500 })
  }
}