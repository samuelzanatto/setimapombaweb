import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const mensagemSchema = z.object({
  titulo: z.string().min(3),
  data: z.string().transform(str => new Date(str)),
  cidade: z.string(),
  estado: z.string(),
  pais: z.string(),
  traduzidoPor: z.string().optional(),
  conteudo: z.string(),
  pdfUrl: z.string().optional()
})

export async function GET() {
  try {
    const mensagens = await prisma.mensagem.findMany()
    return NextResponse.json(mensagens)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar mensagens' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const validatedData = mensagemSchema.parse(data)
    const mensagem = await prisma.mensagem.create({ data: validatedData })
    return NextResponse.json(mensagem)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar mensagem' }, { status: 500 })
  }
}