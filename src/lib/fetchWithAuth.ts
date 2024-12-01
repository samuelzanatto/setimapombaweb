export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    window.location.href = '/login'
    return
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  }

  try {
    console.log('Iniciando requisição para:', url)

    const response = await fetch(url, {
      ...options,
      headers
    })

    console.log('Status da resposta:', response.status)

    // Verifica se há conteúdo antes de fazer parse
    const text = await response.text()
    console.log('Resposta bruta:', text)

    if (!response.ok) {
      throw new Error(text || 'Erro na requisição')
    }

    if (!response.ok) {
      throw new Error(text || `Erro ${response.status}: ${response.statusText}`)
    }

    return text ? JSON.parse(text) : null

  } catch (error) {
    console.error('Erro detalhado:', {
      message: error.message,
      url,
      options
    })
    throw new Error(`Erro na requisição: ${error.message}`)
  }
}