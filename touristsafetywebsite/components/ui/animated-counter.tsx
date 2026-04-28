"use client"

import { useState, useEffect } from "react"

interface AnimatedCounterProps {
  end: number
  start?: number
  duration?: number
  className?: string
}

export function AnimatedCounter({ end, start = 0, duration = 2000, className = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(start)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(start + (end - start) * easeOutQuart)

      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, start, duration])

  return <span className={className}>{count}</span>
}
