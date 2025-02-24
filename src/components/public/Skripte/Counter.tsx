'use client'
import React, { useState, useEffect, useRef } from 'react'

interface CounterProps {
  end: number
  duration?: number
}

const Counter: React.FC<CounterProps> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0)
  const counterRef = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!counterRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          startCounting()
        }
      },
      { threshold: 0.5 },
    )

    observer.observe(counterRef.current)
    return () => observer.disconnect()
  })

  const startCounting = () => {
    const steps = 400
    const stepTime = duration / steps
    let current = 0
    let progress = 0

    const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4)

    const timer = setInterval(() => {
      progress += 1 / steps
      current = end * easeOutQuart(progress)

      if (progress >= 1) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }

  return (
    <span ref={counterRef} className="text-5xl font-bold text-primary">
      {count}
    </span>
  )
}

export default Counter
