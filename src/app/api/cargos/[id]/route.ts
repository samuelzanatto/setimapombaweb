import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const cargoSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres')
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const { nome } = cargoSchema.parse(data)
    
    const cargo = await prisma.cargo.update({
      where: { id: Number(params.id) },
      data: { nome }
    })
    
    return NextResponse.json(cargo)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao atualizar cargo' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.cargo.delete({
      where: { id: Number(params.id) }
    })
    
    return NextResponse.json({ message: 'Cargo deletado com sucesso' })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar cargo' }, { status: 500 })
  }
}