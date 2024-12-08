import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const localSchema = z.object({
  nome: z.string().min(3),
  latitude: z.number(),
  longitude: z.number()
})

export async function GET() {
  try {
    const locais = await prisma.local.findMany()
    return NextResponse.json(locais)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar locais' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validatedData = localSchema.parse(data)
    const local = await prisma.local.create({ data: validatedData })
    return NextResponse.json(local)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar local' }, { status: 500 })
  }
}