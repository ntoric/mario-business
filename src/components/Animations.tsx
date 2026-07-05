import { useEffect, useState, type ReactNode } from 'react'

export function FadeSlideIn({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <div
      className={`transition-all duration-350 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function StaggeredAnimation({
  children,
  index,
  className = '',
}: {
  children: ReactNode
  index: number
  className?: string
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 80)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      className={`transition-all duration-350 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function ShimmerBox({
  className = '',
}: {
  className?: string
}) {
  return <div className={`shimmer-box rounded-2xl ${className}`} />
}

export function AnimatedProgress({
  value,
  color = '#7B6EF6',
  height = 8,
}: {
  value: number
  color?: string
  height?: number
}) {
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setWidth(value * 100), 100)
    return () => clearTimeout(timer)
  }, [value])

  return (
    <div
      className="w-full bg-gray200 rounded-full overflow-hidden"
      style={{ height: `${height}px` }}
    >
      <div
        className="rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${width}%`,
          height: '100%',
          backgroundColor: color,
        }}
      />
    </div>
  )
}

export function GlassCard({
  children,
  className = '',
  onClick,
}: {
  children: ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl card-shadow transition-all duration-350 ${className} ${
        onClick ? 'cursor-pointer active:scale-95' : ''
      }`}
    >
      {children}
    </div>
  )
}
