import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const hinoSchema = z.object({
  titulo: z.string().min(3),
  autor: z.string(),
  letra: z.string()
})

export async function GET() {
  try {
    const hinos = await prisma.hino.findMany()
    return NextResponse.json(hinos)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar hinos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validatedData = hinoSchema.parse(data)
    const hino = await prisma.hino.create({ data: validatedData })
    return NextResponse.json(hino)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar hino' }, { status: 500 })
  }
}