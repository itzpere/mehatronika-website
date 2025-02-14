import React from 'react'
import Hero from '@/components/public/Hero'
import Kontakt from '@/components/public/Kontakt'
import MailSubscription from '@/components/public/Mail'
import Skripte from '@/components/public/Skripte'
// import { auth } from '@/utils/auth'
// import { headers } from 'next/headers'

// export async function ServerComponent() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   })
//   if (!session) {
//     return <div>Not authenticated</div>
//   }
//   return (
//     <div>
//       <h1>Welcome {session.user.name}</h1>
//     </div>
//   )
// }

export default async function HomePage() {
  return (
    <div className="space-y-24 md:space-y-50 py-0 md:py-12">
      {/* <ServerComponent /> */}
      <Hero />
      <MailSubscription />
      <Skripte />
      <Kontakt />
    </div>
  )
}
