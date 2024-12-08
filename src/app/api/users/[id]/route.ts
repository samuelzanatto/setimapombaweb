import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Editar usuário
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const { password, ...updateData } = data // Remove password do objeto de atualização

    const user = await prisma.user.update({
      where: { id: Number(params.id) },
      data: {
        ...updateData,
        cargoId: updateData.cargoId ? Number(updateData.cargoId) : null
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        createdAt: true
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar usuário' }, 
      { status: 500 }
    )
  }
}

// Deletar usuário
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.user.delete({
      where: { id: Number(params.id) }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao excluir usuário' },
      { status: 500 }
    )
  }
}