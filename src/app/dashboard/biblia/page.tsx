'use client'

import { useState, useEffect } from "react"
import { Separator } from "@/components/ui/separator"
import { 
    Tabs, 
    TabsList, 
    TabsTrigger 
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

export default function BibliaPage() {
    const [books, setBooks] = useState<Book[]>([])
    const [selectedBook, setSelectedBook] = useState<string>('')
    const [selectedChapter, setSelectedChapter] = useState<number>(1)
    const [verses, setVerses] = useState<Verse[]>([])
    const [loading, setLoading] = useState(true)

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

    return (
        <main className="flex flex-col w-full h-full pb-10">
          {loading ? (
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
          ) : (
            <Tabs 
            value={selectedBook} 
            onValueChange={setSelectedBook} 
            defaultValue={books.length > 0 ? books[0].abbrev.pt : ""}
            className="w-full h-full"
            >
            <header className="w-full h-32">
                <TabsList className="flex flex-wrap gap-1 bg-transparent">
                  {books.map((book) => (
                    <TabsTrigger 
                      key={`${book.abbrev.pt}-${book.id}`}
                      value={book.abbrev.pt}
                      className="text-xs min-w-16"
                    >
                      {book.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
            </header>

            <Separator />

            <div className="flex flex-row w-full h-full items-center justify-center">
                <aside className="w-1/3 h-full">
                  <ScrollArea className="h-[calc(80vh-4rem)] p-4">
                    {selectedBook && books.find(b => b.abbrev.pt === selectedBook)?.chapters && (
                      <div className="grid grid-cols-5 gap-2">
                        {Array.from(
                          { length: books.find(b => b.abbrev.pt === selectedBook)!.chapters },
                          (_, i) => i + 1
                        ).map((chapter) => (
                          <Button
                            key={chapter}
                            variant={selectedChapter === chapter ? "default" : "outline"}
                            onClick={() => setSelectedChapter(chapter)}
                          >
                            {chapter}
                          </Button>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </aside>

                <Separator orientation="vertical" />

                <article className="w-2/3 px-6">
                    <ScrollArea className="h-[calc(84vh-4rem)] px-2 mt-[-7rem]">
                        <div className="pr-10">
                          {verses.map((verse) => (
                            <p 
                              key={verse.number} 
                              id={`verse-${verse.number}`}
                              className="mb-4"
                            >
                              <span className="font-bold mr-2">{verse.number}</span>
                              {verse.text}
                            </p>
                          ))}
                        </div>
                    </ScrollArea>
                </article>
            </div>
            </Tabs>
            )}
        </main>
    )
}