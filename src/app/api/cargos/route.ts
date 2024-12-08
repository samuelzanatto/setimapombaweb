import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const cargoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres')
})

export async function GET() {
  try {
    const cargos = await prisma.cargo.findMany()
    return NextResponse.json(cargos)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar cargos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { nome } = cargoSchema.parse(data)
    
    const cargo = await prisma.cargo.create({
      data: { nome }
    })
    
    return NextResponse.json(cargo)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar cargo' }, { status: 500 })
  }
}