import { NextResponse } from 'next/server'

const API_TOKEN = process.env.BIBLIA_API_TOKEN
const API_URL = 'https://www.abibliadigital.com.br/api'

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/books`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    })
    
    if (!response.ok) {
      throw new Error('Erro ao buscar livros')
    }
    
    const data = await response.json()
    
    // Garantir que retornamos um array e que os dados estão no formato correto
    if (!Array.isArray(data)) {
      console.error('API da Bíblia não retornou um array:', data)
      return NextResponse.json([])
    }
    
    // Log para debug
    console.log('Dados dos livros:', data)
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar livros da Bíblia:', error)
    return NextResponse.json([])
  }
}