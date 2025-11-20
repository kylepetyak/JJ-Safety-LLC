import { Check } from 'lucide-react'

interface ChecklistItemProps {
  checked?: boolean
  children: React.ReactNode
}

export function ChecklistItem({ checked = false, children }: ChecklistItemProps) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
          checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
        }`}
      >
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className={checked ? 'line-through text-gray-500' : 'text-gray-700'}>
        {children}
      </span>
    </div>
  )
}
