import useSWR from 'swr'

export function useLives() {
  const { data, error, isLoading } = useSWR(
    '/api/lives',
    fetch,
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