import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const cultoSchema = z.object({
  titulo: z.string().min(3),
  dataInicio: z.string().transform(str => new Date(str)),
  dataTermino: z.string().transform(str => new Date(str)),
  localId: z.number(),
  status: z.enum(['agendado', 'em_andamento', 'concluido']),
  pastorId: z.number(),
  obreiroId: z.number(),
  liderCanticoId: z.number(),
  vocalIds: z.array(z.number()),
  hinoIds: z.array(z.number()),
  mensagemIds: z.array(z.number()),
  leituras: z.array(z.object({
    livro: z.string(),
    capitulo: z.number(),
    versiculos: z.string()
  })),
  videoUrl: z.string().optional(),
})

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const culto = await prisma.culto.findUnique({
      where: { 
        id: Number(params.id) 
      },
      include: {
        local: true,
        pastor: true,
        obreiro: true,
        liderCantico: true,
        vocal: true,
        hinos: true,
        mensagens: true,
        leituras: {
          select: {
            id: true,
            livro: true,
            capitulo: true,
            versiculos: true
          }
        }
      }
    })

    if (!culto) {
      return NextResponse.json(
        { error: 'Culto não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(culto)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar culto' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const validatedData = cultoSchema.parse(data)
    
    const item = await prisma.culto.update({
      where: { id: Number(params.id) },
      data: {
        ...validatedData,
        vocal: {
          set: validatedData.vocalIds.map(id => ({ id }))
        },
        hinos: {
          set: validatedData.hinoIds.map(id => ({ id }))
        },
        mensagens: {
          set: validatedData.mensagemIds.map(id => ({ id }))
        },
        leituras: {
          deleteMany: {},
          create: validatedData.leituras
        }
      },
      include: {
        local: true,
        pastor: true,
        obreiro: true,
        liderCantico: true,
        vocal: true,
        hinos: true,
        mensagens: true,
        leituras: true
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
    await prisma.culto.delete({
      where: { id: Number(params.id) }
    })
    return NextResponse.json({ message: 'Deletado com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar' }, { status: 500 })
  }
}