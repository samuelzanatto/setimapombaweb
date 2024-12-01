import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-key-seguro'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Validar inputs
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 401 }
      )
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password)
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Senha incorreta' },
        { status: 401 }
      )
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        username: user.username
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
      },
      token
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
    })

    return response

  } catch (error) {
    console.error('Erro durante login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}