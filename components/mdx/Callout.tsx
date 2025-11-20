import { cn } from '@/lib/utils'

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'danger'
  children: React.ReactNode
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    danger: 'bg-red-50 border-red-200 text-red-900',
  }

  return (
    <div className={cn('rounded-lg border-l-4 p-6 my-6', styles[type])}>
      {children}
    </div>
  )
}
