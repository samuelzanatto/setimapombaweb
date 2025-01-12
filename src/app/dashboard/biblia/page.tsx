'use client'

import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ChevronLeft } from "lucide-react"

export default function BibliaPage() {
    const [books, setBooks] = useState<Book[]>([])
    const [selectedBook, setSelectedBook] = useState<string>('')
    const [selectedChapter, setSelectedChapter] = useState<number>(1)
    const [verses, setVerses] = useState<Verse[]>([])
    const [loading, setLoading] = useState(true)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [showVerses, setShowVerses] = useState(false)

    useEffect(() => {
        async function loadBooks() {
          setLoading(true)
          const response = await fetch('/api/bible/books')
          const data = await response.json()
          setBooks(data)
          setLoading(false)
        }
        loadBooks()
      }, [])

    useEffect(() => {
      if (books.length > 0 && !selectedBook) {
        setSelectedBook(books[0].abbrev.pt)
      }
    }, [books])
    
    useEffect(() => {
        if (selectedBook && selectedChapter) {
          async function loadVerses() {
            try {
              const response = await fetch(
                `/api/bible/verses?book=${selectedBook}&chapter=${selectedChapter}`
              )
              const data = await response.json()
              if (data) {
                setVerses(data.verses)
              } else {
                setVerses([])
              }
            } catch (error) {
              console.error('Erro ao carregar versículos:', error)
              setVerses([])
            }
          }
          loadVerses()
        }
    }, [selectedBook, selectedChapter])

    const handleBookSelect = (book: string) => {
        setSelectedBook(book)
        setIsDrawerOpen(true)
        setShowVerses(false)
    }

    const handleChapterSelect = (chapter: number) => {
        setSelectedChapter(chapter)
        setIsDrawerOpen(false)
        setShowVerses(true)
    }

    if (loading) {
        return (
            <div className="w-full h-full p-4">
              <div className="space-y-4">
                {/* Skeleton para os livros */}
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 66 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-16" />
                  ))}
                </div>
                
                {/* Container flex para capítulos e versículos */}
                <div className="flex gap-4">
                  {/* Skeleton para os capítulos - 1/3 da largura */}
                  <div className="w-1/3">
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-full" />
                      ))}
                    </div>
                  </div>
                    
                  {/* Separador vertical */}
                  <div className="w-[1px] bg-border" />
                    
                  {/* Skeleton para os versículos - 2/3 da largura */}
                  <div className="w-2/3 space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-4 w-full" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
        )
    }

    const selectedBookData = books.find(b => b.abbrev.pt === selectedBook)

    return (
        <main className="flex flex-col w-full h-full pb-10">
            {!showVerses ? (
                <div className="w-full p-4">
                    <h2 className="text-2xl font-bold mb-4">Selecione um Livro</h2>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                        {books.map((book) => (
                            <Button
                                key={book.abbrev.pt}
                                variant={selectedBook === book.abbrev.pt ? "default" : "outline"}
                                onClick={() => handleBookSelect(book.abbrev.pt)}
                                className="w-full text-xs"
                            >
                                {book.name}
                            </Button>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="w-full h-full">
                    <div className="p-4">
                        <Button variant="outline" onClick={() => setShowVerses(false)} className="mb-4">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Voltar para Livros
                        </Button>
                        <h2 className="text-2xl font-bold">
                            {selectedBookData?.name} {selectedChapter}
                        </h2>
                    </div>
                    <ScrollArea className="h-[calc(100vh-12rem)] px-4">
                        <div className="pr-4">
                            {verses.map((verse) => (
                                <p key={verse.number} className="mb-4">
                                    <span className="font-bold mr-2">{verse.number}</span>
                                    {verse.text}
                                </p>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}

            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Selecione o Capítulo - {selectedBookData?.name}</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4">
                        <div className="grid grid-cols-6 gap-2">
                            {selectedBookData && Array.from(
                                { length: selectedBookData.chapters },
                                (_, i) => i + 1
                            ).map((chapter) => (
                                <Button
                                    key={chapter}
                                    variant={selectedChapter === chapter ? "default" : "outline"}
                                    onClick={() => handleChapterSelect(chapter)}
                                >
                                    {chapter}
                                </Button>
                            ))}
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </main>
    )
}