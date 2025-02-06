'use client'
import React, { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/dialog'
import { Input } from '@/components/input'
import { Button } from '@/components/button'

interface NewsletterFormProps {
  onSubmit: (
    email: string,
    years: number[],
    subscribeToBoard: boolean,
  ) => Promise<{ success: boolean; error?: string; warn?: string }>
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('')
  const [selectedYears, setSelectedYears] = useState<number[]>([1])
  const [subscribeToBoard, setSubscribeToBoard] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return pattern.test(email.trim())
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setEmail(value)
    if (!validateEmail(value) && value !== '') {
      setEmailError('Unesite validnu email adresu')
    } else {
      setEmailError('')
    }
  }

  const handleDialogOpen = () => {
    if (!validateEmail(email)) {
      setEmailError('Unesite validnu email adresu')
      return
    }
    setOpen(true)
  }

  const handleDialogSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateEmail(email) || selectedYears.length === 0) {
      toast.error('Molimo popunite sva obavezna polja')
      return
    }

    setIsLoading(true)
    try {
      const result = await onSubmit(email, selectedYears, subscribeToBoard)
      if (result.success) {
        if (result.warn) {
          toast.success(result.warn)
        } else {
          toast.success('Uspešno ste se prijavili na newsletter!')
        }
        setOpen(false)
        setEmail('')
        setSelectedYears([1])
        setSubscribeToBoard(true)
      } else {
        toast.error(result.error || 'Došlo je do greške')
      }
    } catch (error) {
      toast.error('Došlo je do greške')
      console.error('Submission failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleYearToggle = (year: number) => {
    setSelectedYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year].sort(),
    )
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 sm:flex-row">
      <div className="w-full">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
          required
          aria-label="Email adresa"
          aria-invalid={!!emailError}
          aria-describedby={emailError ? 'email-error' : undefined}
          className={`transition-all py-4 duration-200 ${emailError ? 'border-error' : 'border-primary-light'}`}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            onClick={handleDialogOpen}
            disabled={isLoading || !email || !!emailError}
            className="w-full bg-primary sm:w-auto whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Učitavanje...
              </>
            ) : (
              'Prijavi se'
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="rounded-lg p-6 shadow-xl">
          <form onSubmit={handleDialogSubmit}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Izaberite godine studija
              </DialogTitle>
              <DialogDescription className="mt-2 text-gray-600">
                Odaberite godine studija za koje želite da primate obaveštenja
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((year) => (
                <label
                  key={year}
                  className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-gray-200 p-4 transition-all duration-200 hover:border-primary hover:bg-gray-50"
                >
                  <Input
                    type="checkbox"
                    checked={selectedYears.includes(year)}
                    onChange={() => handleYearToggle(year)}
                    className="mr-2 h-4 w-4 accent-primary"
                    aria-label={`${year}. godina`}
                  />
                  <span className="font-medium text-gray-700">{year}. godina</span>
                </label>
              ))}
            </div>

            <div className="mt-4">
              <label className="flex cursor-pointer items-center rounded-lg border-2 border-gray-200 p-4 transition-all duration-200 hover:border-primary hover:bg-gray-50">
                <Input
                  type="checkbox"
                  checked={subscribeToBoard}
                  onChange={(e) => setSubscribeToBoard(e.target.checked)}
                  className="mr-2 h-4 w-4 accent-primary"
                  aria-label="Prijava na oglasnu tablu"
                />
                <span className="font-medium text-gray-700">Oglasna tabla</span>
                <span className="ml-2 italic text-gray-500">(rezultati predmeta)</span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Otkaži
              </Button>
              <Button type="submit" disabled={isLoading || selectedYears.length === 0}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Učitavanje...
                  </>
                ) : (
                  'Potvrdi'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default NewsletterForm
