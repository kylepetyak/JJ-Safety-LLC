interface YouTubeProps {
  id: string
  title?: string
}

export function YouTube({ id, title = 'YouTube video' }: YouTubeProps) {
  return (
    <div className="relative my-8 aspect-video w-full overflow-hidden rounded-lg bg-gray-900 shadow-md">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
