import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import * as bcrypt from 'bcrypt'

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        createdAt: true,
        online: true,
        cargo: {
          select: {
            id: true,
            nome: true
          }
        }
      }
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const hashedPassword = await bcrypt.hash(data.password, 10)
    
    const user = await prisma.user.create({
      data: {
        ...data,
        cargoId: data.cargoId ? Number(data.cargoId) : undefined,
        password: hashedPassword
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar usuário' }, { status: 500 })
  }
}