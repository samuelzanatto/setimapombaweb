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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const validatedData = eventoSchema.parse(data)
    
    const item = await prisma.evento.update({
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
    await prisma.evento.delete({
      where: { id: Number(params.id) }
    })
    return NextResponse.json({ message: 'Deletado com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 })
  }
}