'use client'
import { SiGoogle } from '@icons-pack/react-simple-icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth/auth-client'
import { cn } from '@/lib/utils/cn'

const loginSchema = z.object({
  email: z.string().email('Unesite validnu email adresu'),
  password: z.string().min(6, 'Lozinka mora imati najmanje 6 karaktera'),
})

type LoginFormData = z.infer<typeof loginSchema>

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  isSubmitted?: boolean
  animationKey: number
  rightElement?: React.ReactNode
}

function FormInput({
  label,
  error,
  isSubmitted,
  animationKey,
  rightElement,
  ...props
}: FormInputProps) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center">
        <Label htmlFor={props.id}>{label}</Label>
        {rightElement}
      </div>
      <Input
        {...props}
        key={`${props.id}-${animationKey}`}
        className={cn(
          props.className,
          error && 'border-error hover:border-error',
          isSubmitted && error && 'animate-shake',
        )}
        autoComplete={
          props.id === 'email'
            ? 'username'
            : props.id === 'password'
              ? 'current-password'
              : undefined
        }
      />
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [errors, setErrors] = useState<Partial<LoginFormData>>({})
  const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [animationKey, setAnimationKey] = useState(0)
  const router = useRouter()

  useEffect(() => {
    // Check for browser autofill after a short delay
    const timer = setTimeout(() => {
      const emailInput = document.getElementById('email') as HTMLInputElement
      const passwordInput = document.getElementById('password') as HTMLInputElement

      if (emailInput?.value && emailInput.value !== formData.email) {
        setFormData((prev) => ({ ...prev, email: emailInput.value }))
      }

      if (passwordInput?.value && passwordInput.value !== formData.password) {
        setFormData((prev) => ({ ...prev, password: passwordInput.value }))
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [formData.email, formData.password])

  const validateField = (field: keyof LoginFormData, value: string) => {
    const result = loginSchema.shape[field].safeParse(value)
    if (!result.success) {
      setErrors((prev) => ({ ...prev, [field]: result.error.issues[0].message }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    setAnimationKey((prev) => prev + 1)
    const result = loginSchema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Partial<LoginFormData> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as keyof LoginFormData] = issue.message
        }
      })
      setErrors(fieldErrors)
      return
    }

    try {
      const promise = authClient.signIn.email({
        email: formData.email,
        password: formData.password,
      })

      toast.promise(promise, {
        loading: 'Prijavljivanje...',
        error: 'Neuspešna prijava',
      })

      const { data: _data, error } = await promise

      if (error) throw error

      router.push('/')
      router.refresh()
    } catch {
      setErrors({
        email: 'Nevazeci email',
      })
    }
  }

  const handleChange = (field: keyof LoginFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const inputFields = [
    {
      id: 'email',
      label: 'Email adresa',
      type: 'email',
      placeholder: 'm@example.com',
    },
    {
      id: 'password',
      label: 'Lozinka',
      type: 'password',
      rightElement: (
        <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
          Zaboravili ste lozinku?
        </a>
      ),
    },
  ]

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Prijava</CardTitle>
          <CardDescription>Ulogujte se na svoj nalog</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {inputFields.map(({ id, label, type, placeholder, rightElement }) => (
              <FormInput
                key={id}
                id={id}
                label={label}
                type={type}
                placeholder={placeholder}
                value={formData[id as keyof LoginFormData]}
                onChange={handleChange(id as keyof LoginFormData)}
                onBlur={() =>
                  validateField(id as keyof LoginFormData, formData[id as keyof LoginFormData])
                }
                error={errors[id as keyof LoginFormData]}
                isSubmitted={isSubmitted}
                animationKey={animationKey}
                rightElement={rightElement}
              />
            ))}

            <div className="space-y-4">
              <Button type="submit" className="w-full">
                Prijavi se
              </Button>
              <Button
                variant="outline"
                className="w-full"
                disabled
                onClick={async () => {
                  try {
                    const promise = authClient.signIn.social({
                      provider: 'google',
                      callbackURL: '/',
                      errorCallbackURL: '/login?error=auth-failed',
                      newUserCallbackURL: '/welcome',
                    })

                    toast.promise(promise, {
                      loading: 'Povezivanje sa Google...',
                      error: 'Greška pri povezivanju',
                    })

                    await promise
                  } catch (error) {
                    console.error('Google auth error:', error)
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

            <div className="mt-4 text-center text-sm">
              Nemate nalog?{' '}
              <Link href="/register" className="underline underline-offset-4">
                Registrujte se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
//FIXME: popravi google
