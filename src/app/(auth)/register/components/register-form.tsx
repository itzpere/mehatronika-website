'use client'

import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SiGoogle } from '@icons-pack/react-simple-icons'
import { authClient } from '@/utils/auth-client'
import { toast } from 'sonner'

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Ime mora imati najmanje 2 karaktera'),
    lastName: z.string().min(2, 'Prezime mora imati najmanje 2 karaktera'),
    email: z.string().email('Unesite validnu email adresu'),
    password: z.string().min(6, 'Lozinka mora imati najmanje 6 karaktera'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Lozinke se ne poklapaju',
    path: ['confirmPassword'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  isSubmitted?: boolean
  animationKey: number
}

function FormInput({ label, error, isSubmitted, animationKey, ...props }: FormInputProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={props.id}>{label}</Label>
      <Input
        {...props}
        key={`${props.id}-${animationKey}`}
        className={cn(
          props.className,
          error && 'border-error',
          isSubmitted && error && 'animate-shake',
        )}
      />
      {error && <p className="text-sm text-error">{}</p>}
    </div>
  )
}

export function RegisterForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [errors, setErrors] = useState<Partial<RegisterFormData>>({})
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const router = useRouter()

  const validateField = (field: keyof RegisterFormData, value: string) => {
    if (field === 'confirmPassword') {
      if (formData.password !== value) {
        setErrors((prev) => ({ ...prev, confirmPassword: 'Lozinke se ne poklapaju' }))
        setAnimationKey((prev) => prev + 1)
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
      }
      return
    }

    // Create a single-field schema for validation
    const fieldSchema = z.object({ [field]: registerSchema._def.schema.shape[field] })
    const result = fieldSchema.safeParse({ [field]: value })

    if (!result.success) {
      setErrors((prev) => ({ ...prev, [field]: result.error.issues[0].message }))
      setAnimationKey((prev) => prev + 1)
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    const result = registerSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<RegisterFormData> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof RegisterFormData] = issue.message
        }
      })
      setErrors(fieldErrors)
      setAnimationKey((prev) => prev + 1)
      return
    }

    try {
      const promise = authClient.signUp.email({
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`,
        callbackURL: '/',
      })

      toast.promise(promise, {
        loading: 'Kreiranje naloga...',
        error: 'Greška pri kreiranju naloga',
      })

      const { data: _data, error } = await promise
      if (error) throw error

      router.push('/login?message=check-email')
    } catch (error) {
      setErrors({
        email: (error as Error).message,
      })
      setAnimationKey((prev) => prev + 1)
    }
  }

  const handleChange =
    (field: keyof RegisterFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setFormData((prev) => ({ ...prev, [field]: newValue }))
    }

  const inputFields = [
    { id: 'firstName', label: 'Ime', type: 'text' },
    { id: 'lastName', label: 'Prezime', type: 'text' },
    { id: 'email', label: 'Email adresa', type: 'email' },
    { id: 'password', label: 'Lozinka', type: 'password' },
    { id: 'confirmPassword', label: 'Potvrdite lozinku', type: 'password' },
  ]

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Registracija</CardTitle>
          <CardDescription>Kreirajte svoj nalog</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {inputFields.map(({ id, label, type }) => (
              <FormInput
                key={id}
                id={id}
                label={label}
                type={type}
                value={formData[id as keyof RegisterFormData]}
                onChange={handleChange(id as keyof RegisterFormData)}
                onBlur={() =>
                  validateField(
                    id as keyof RegisterFormData,
                    formData[id as keyof RegisterFormData],
                  )
                }
                error={errors[id as keyof RegisterFormData]}
                isSubmitted={isSubmitted}
                animationKey={animationKey}
              />
            ))}

            <div className="space-y-4">
              <Button type="submit" className="w-full">
                Registruj se
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={async () => {
                  try {
                    const promise = authClient.signIn.social({
                      provider: 'google',
                      callbackURL: '/dashboard',
                      errorCallbackURL: '/register?error=auth-failed',
                      newUserCallbackURL: '/welcome',
                    })

                    toast.promise(promise, {
                      loading: 'Povezivanje sa Google...',
                      error: 'Greška pri povezivanju',
                    })

                    await promise
                  } catch (_error) {
                    setErrors({
                      email: 'Google authentication failed',
                    })
                  }
                }}
              >
                <SiGoogle className="mr-2" size={24} />
                Google prijava
              </Button>
            </div>

            <div className="text-center text-sm">
              <Link href="/login" className="underline underline-offset-4">
                Prijavite se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
//FIXME: popravi google
