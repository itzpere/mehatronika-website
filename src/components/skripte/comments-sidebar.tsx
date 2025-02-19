'use client'
import { MessageSquare, X } from 'lucide-react'
import { useState, createContext, useContext } from 'react'
import { cn } from '@/lib/utils/cn'

export const CommentsContext = createContext<{
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}>({
  isOpen: false,
  setIsOpen: () => {},
})

export function useComments() {
  return useContext(CommentsContext)
}

export function CommentsProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <CommentsContext.Provider value={{ isOpen, setIsOpen }}>
      <div
        className={cn('h-full flex-1 overflow-auto transition-all duration-200', isOpen && 'mr-80')}
      >
        {children}
      </div>
    </CommentsContext.Provider>
  )
}
// FIXME: on mobile ti should go over content and not cause scaling on x
export function CommentSidebar() {
  const { isOpen, setIsOpen } = useComments()

  return (
    <div
      className={cn(
        'fixed right-0 bg-background border-l p-4 transition-all duration-200',
        'top-36',
        'h-[100vh]',
        'w-80',
        !isOpen && 'translate-x-full',
        'animate-in slide-in-from-right',
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Komentari</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-4" />
        </button>
      </div>
      <div className="space-y-4">
        {/* Unos komentara */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Dodaj komentar..."
            className="flex-1 bg-muted/50 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-md px-3 py-2 text-sm font-medium">
            Objavi
          </button>
        </div>

        {/* Primeri komentara */}
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
                  <span className="text-sm font-medium">Ime Korisnika</span>
                </div>
                <span className="text-xs text-muted-foreground">pre 2h</span>
              </div>
              <p className="text-sm text-muted-foreground pl-10">
                Ovo je primer komentara koji pokazuje kako će izgledati raspored sa pravim
                sadržajem.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
//FIXME: every button light up when clicked
//when clicked only that button should light up to show of what file is it
export function CommentButton() {
  const { isOpen, setIsOpen } = useComments()

  return (
    <button
      type="button"
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        'rounded-md p-1.5 transition-colors',
        isOpen
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          : 'text-muted-foreground hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-400',
      )}
      title="Komentari"
    >
      <MessageSquare className="size-4" />
    </button>
  )
}
