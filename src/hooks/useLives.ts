import useSWR from 'swr'

export function useLives() {
  const { data, error, isLoading } = useSWR(
    '/api/lives',
    async (url) => {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Falha ao carregar as lives')
      }
      const json = await response.json()
      return json
    },
    {
      refreshInterval: 5 * 60 * 1000, // 5 minutos
      revalidateOnFocus: false
    }
  )

  return {
    lives: data?.lives || [],
    isLoading,
    error
  }
}