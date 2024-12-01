import { NextResponse } from 'next/server'

const API_TOKEN = process.env.BIBLIA_API_TOKEN
const API_URL = 'https://www.abibliadigital.com.br/api'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const book = searchParams.get('book')
    const chapter = searchParams.get('chapter')
  
    const response = await fetch(
      `${API_URL}/verses/nvi/${book}/${chapter}`,
      { headers: { Authorization: `Bearer ${API_TOKEN}` } }
    )
    const data = await response.json()
    return NextResponse.json(data)
  }