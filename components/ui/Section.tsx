import { cn } from '@/lib/utils'
import Container from './Container'

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerSize?: 'sm' | 'md' | 'lg' | 'xl'
  background?: 'white' | 'gray' | 'navy' | 'gradient'
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
}

export default function Section({
  children,
  className,
  containerSize = 'lg',
  background = 'white',
  spacing = 'lg',
}: SectionProps) {
  const backgrounds = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    navy: 'bg-navy-950 text-white',
    gradient: 'bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white',
  }

  const spacings = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20 lg:py-24',
    xl: 'py-24 lg:py-32',
  }

  return (
    <section className={cn(backgrounds[background], spacings[spacing], className)}>
      <Container size={containerSize}>
        {children}
      </Container>
    </section>
  )
}
