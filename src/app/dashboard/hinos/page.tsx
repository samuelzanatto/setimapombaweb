'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

interface Hino {
  id: number
  titulo: string
  autor: string
  letra: string
  createdAt: string
  updatedAt: string
}

export default function HinosPage() {
  const { toast } = useToast()
  const [hinos, setHinos] = useState<Hino[]>([])
  const [viewHino, setViewHino] = useState<Hino | null>(null)

  useEffect(() => {
    fetchHinos()
  }, [])

  const fetchHinos = async () => {
    try {
      const response = await fetch('/api/hinos')
      const data = await response.json()
      setHinos(data)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao carregar hinos"
      })
    }
  }

  return (
    <main className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Hinário</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hinos.map((hino) => (
            <TableRow 
              key={hino.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => setViewHino(hino)}
            >
              <TableCell>{hino.id}</TableCell>
              <TableCell>{hino.titulo}</TableCell>
              <TableCell>{hino.autor}</TableCell>
              <TableCell>
                {new Date(hino.createdAt).toLocaleDateString('pt-BR')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!viewHino} onOpenChange={() => setViewHino(null)}>
        <DialogContent className="max-w-[600px] h-[800px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              {viewHino?.titulo}
            </DialogTitle>
            <div className="text-sm text-center text-muted-foreground">
              Autor: {viewHino?.autor}
            </div>
          </DialogHeader>

          <div className="flex-1 bg-white rounded-md text-center p-8 overflow-auto">
            <div className="prose max-w-none">
              {viewHino?.letra.split('\n\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="mb-6 whitespace-pre-line">
                    {paragraph}
                  </p>
                )
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}