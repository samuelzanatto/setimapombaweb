import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json(
        { error: 'Senha é obrigatória' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.update({
      where: { id: Number(params.id) },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao atualizar senha' },
      { status: 500 }
    )
  }
}