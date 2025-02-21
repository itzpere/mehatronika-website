import { RegisterForm } from './components/register-form'

export const metadata = {
  description: 'Stranica za prijavljivanje i registraciju',
  title: 'Register',
}

export default function RegisterPage() {
  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center">
      <RegisterForm />
    </main>
  )
}
