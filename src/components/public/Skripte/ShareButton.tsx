'use client'

import { Share2 } from 'lucide-react'
import { useState } from 'react'

export default function ShareButton() {
  const [showPopup, setShowPopup] = useState(false)

  const handleClick = () => {
    setShowPopup(true)
    setTimeout(() => setShowPopup(false), 3000) // Hide after 3 seconds
  }

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-secondary px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/20 active:scale-95 relative overflow-hidden"
      >
        <span className="relative z-10">Podeli svoje skripte</span>
        <Share2 className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
      </button>

      {showPopup && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 px-4 py-2 bg-background border border-primary/20 rounded-lg shadow-lg z-50 animate-fade-in">
          <p className="text-sm whitespace-nowrap">Ova funkcija još nije implementirana</p>
        </div>
      )}
    </div>
  )
}
