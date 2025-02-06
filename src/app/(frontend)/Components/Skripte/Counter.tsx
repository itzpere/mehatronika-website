'use client'
import React, { useState, useEffect } from 'react'

interface CounterProps {
  end: number
  duration?: number
}

const Counter: React.FC<CounterProps> = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    const steps = 60
    const increment = end / steps
    const stepTime = duration / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [end, duration])

  return <span className="text-5xl font-bold text-primary">{count}</span>
}

export default Counter
