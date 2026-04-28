"use client"

import { useState, useEffect } from "react"

interface AnimatedTextProps {
  text: string
  className?: string
  speed?: number
  showCursor?: boolean
}

export function AnimatedText({ text, className = "", speed = 100, showCursor = true }: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursorState, setShowCursorState] = useState(true)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  useEffect(() => {
    if (showCursor) {
      const cursorInterval = setInterval(() => {
        setShowCursorState((prev) => !prev)
      }, 500)

      return () => clearInterval(cursorInterval)
    }
  }, [showCursor])

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span
          className={`inline-block w-0.5 h-5 bg-current ml-1 ${showCursorState ? "opacity-100" : "opacity-0"} transition-opacity duration-100`}
        />
      )}
    </span>
  )
}
