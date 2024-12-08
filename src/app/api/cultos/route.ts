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

export async function GET() {
  try {
    const cultos = await prisma.culto.findMany({
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
    return NextResponse.json(cultos)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar cultos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validatedData = cultoSchema.parse(data)
    
    // Remover os arrays de IDs que serão usados nas relações
    const { vocalIds, hinoIds, mensagemIds, leituras, ...cultoData } = validatedData
    
    const culto = await prisma.culto.create({
      data: {
        ...cultoData,
        // Criar as relações usando connect
        vocal: {
          connect: vocalIds?.map(id => ({ id })) || []
        },
        hinos: {
          connect: hinoIds?.map(id => ({ id })) || []
        },
        mensagens: {
          connect: mensagemIds?.map(id => ({ id })) || []
        },
        leituras: {
          create: leituras || []
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
    
    return NextResponse.json(culto)
  } catch (error) {
    console.error('Erro detalhado:', error) // Para debug
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ 
      error: 'Erro ao criar culto',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}