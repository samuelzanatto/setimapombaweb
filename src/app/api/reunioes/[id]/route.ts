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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const reuniao = await prisma.reuniao.findUnique({
      where: { 
        id: Number(params.id) 
      },
      include: {
        local: true,
        responsavel: true
      }
    })

    if (!reuniao) {
      return NextResponse.json(
        { error: 'Reunião não encontrada' }, 
        { status: 404 }
      )
    }

    return NextResponse.json(reuniao)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar reunião' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const validatedData = reuniaoSchema.parse(data)
    
    const item = await prisma.reuniao.update({
      where: { id: Number(params.id) },
      data: validatedData,
      include: {
        local: true,
        responsavel: true
      }
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
    await prisma.reuniao.delete({
      where: { id: Number(params.id) }
    })
    return NextResponse.json({ message: 'Deletado com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 })
  }
}