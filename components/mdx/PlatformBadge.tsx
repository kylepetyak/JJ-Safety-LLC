interface PlatformBadgeProps {
  platform: string
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-100 text-accent-800 mr-2">
      {platform}
    </span>
  )
}
