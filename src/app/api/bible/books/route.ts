import { NextResponse } from 'next/server'

const API_TOKEN = process.env.BIBLIA_API_TOKEN
const API_URL = 'https://www.abibliadigital.com.br/api'

export async function GET() {
  const response = await fetch(`${API_URL}/books`, {
    headers: { Authorization: `Bearer ${API_TOKEN}` }
  })
  const data = await response.json()
  return NextResponse.json(data)
}