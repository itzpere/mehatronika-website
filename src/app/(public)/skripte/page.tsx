import { Header } from '@/components/skripte/header'

export default async function Page() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header path="/" />
    </div>
  )
}
