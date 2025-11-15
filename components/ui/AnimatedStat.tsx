'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedStatProps {
  end: number
  duration?: number
  suffix?: string
  label: string
}

export default function AnimatedStat({ end, duration = 2000, suffix = '', label }: AnimatedStatProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * (end - startValue) + startValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, end, duration])

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl font-bold text-accent-400 mb-2">
        {count}{suffix}
      </div>
      <div className="text-lg text-gray-300">{label}</div>
    </div>
  )
}
