import React from 'react'
import Hero from './Components/Hero'
import MailSubscription from './Components/Mail'
import Skripte from './Components/Skripte'
import Kontakt from './Components/Kontakt'
export default async function HomePage() {
  return (
    <div className="space-y-50 py-12">
      <Hero />
      <MailSubscription />
      <Skripte />
      <Kontakt />
    </div>
  )
}
