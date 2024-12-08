import { NextResponse } from 'next/server'

const API_TOKEN = process.env.BIBLIA_API_TOKEN
const API_URL = 'https://www.abibliadigital.com.br/api'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const book = searchParams.get('book')
    const chapter = searchParams.get('chapter')
  
    if (!book) {
      return NextResponse.json({ error: 'Livro é obrigatório' }, { status: 400 })
    }

    try {
      if (chapter) {
        // Buscar versículos do capítulo
        const response = await fetch(
          `${API_URL}/verses/nvi/${book}/${chapter}`,
          { headers: { Authorization: `Bearer ${API_TOKEN}` } }
        )
        const data = await response.json()
        return NextResponse.json(data)
      } else {
        // Buscar capítulos do livro
        const response = await fetch(
          `${API_URL}/books/${book}`,
          { headers: { Authorization: `Bearer ${API_TOKEN}` } }
        )
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (error) {
      console.error('Erro ao buscar dados da Bíblia:', error)
      return NextResponse.json({ error: 'Erro ao buscar dados' }, { status: 500 })
    }
}