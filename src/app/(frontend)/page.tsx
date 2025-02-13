import React from 'react'

import Hero from './Components/Hero'
import MailSubscription from './Components/Mail'
import Skripte from './Components/Skripte'
import Kontakt from './Components/Kontakt'
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
    <div className="space-y-50 py-12">
      {/* <ServerComponent /> */}
      <Hero />
      <MailSubscription />
      <Skripte />
      <Kontakt />
    </div>
  )
}
