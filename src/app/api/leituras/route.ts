import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const leituraBiblicaSchema = z.object({
  livro: z.string(),
  capitulo: z.number(),
  versiculos: z.string()
})

export async function GET() {
  try {
    const leiturasBiblicas = await prisma.leituraBiblica.findMany()
    return NextResponse.json(leiturasBiblicas)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar leituras bíblicas' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validatedData = leituraBiblicaSchema.parse(data)
    const leituraBiblica = await prisma.leituraBiblica.create({ data: validatedData })
    return NextResponse.json(leituraBiblica)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar leitura bíblica' }, { status: 500 })
  }
}