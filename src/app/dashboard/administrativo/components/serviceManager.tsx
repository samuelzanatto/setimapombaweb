'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from '@/components/ui/badge'
import { useLives } from '@/hooks/useLives'

interface Live {
  id: string
  title: string
  thumbnail: string
  description: string
  status: 'live' | 'upcoming' | 'completed'
  publishedAt?: string;
}

const getStatusLabel = (status: Live['status']) => {
  switch (status) {
    case 'live':
      return 'Ao vivo'
    case 'upcoming':
      return 'Agendada'
    case 'completed':
      return 'Concluída'
    default:
      return 'Desconhecido'
  }
}

export default function ServiceManager() {
  const { lives, isLoading, error } = useLives()
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  )

  if (error) return (
    <div className="text-center text-destructive p-4">
      Erro ao carregar transmissões: {error.message}
    </div>
  )

  if (!lives || lives.length === 0) return (
    <div className="text-center p-4">
      Nenhuma transmissão encontrada
    </div>
  )

  const totalPages = Math.ceil(lives.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLives = lives.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <main>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Transmissões ao Vivo</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentLives.map((live) => (
            <Link href={`/dashboard/administrativo/${live.id}`} key={live.id}>
              <div className="flex flex-col justify-between border rounded-lg h-96 overflow-hidden hover:shadow-lg transition-shadow">
                <Image
                  src={live.thumbnail}
                  alt={live.title}
                  width={320}
                  height={180}
                  className="w-full"
                />
                <div className="p-4">
                  <h2 className="font-semibold">{live.title}</h2>
                </div>
                <div className='p-4'>
                  <Badge variant={live.status as 'live' | 'upcoming' | 'completed'}>
                      {getStatusLabel(live.status)}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className='cursor-pointer'
                  />
                </PaginationItem>
                
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1
                  // Mostrar primeira página, última página e páginas próximas à atual
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={page === currentPage}
                          className='cursor-pointer'
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return null
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className='cursor-pointer'
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </main>
  )
}