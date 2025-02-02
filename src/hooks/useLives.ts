import { useEffect, useState } from 'react'
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

export function useCurrentLive() {
  const [live, setLive] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLive = async () => {
    try {
      const response = await fetch('/api/lives/current', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Falha ao buscar live');
      
      const data = await response.json();
      console.log('[useLive] Live data:', data);
      setLive(data.live);

    } catch (error) {
      console.error('[useLive] Error:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLive();
  }, []);

  return { live, isLoading, error };
}