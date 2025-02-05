import React from 'react'
import { cn } from '@/Utils/cn'
import RichText from '@/components/RichText'

interface VideoSettings {
  autoplay?: boolean
  startTime?: number
}

type Props = {
  className?: string
  videoURL: string
  title?: string
  caption?: string
  settings?: VideoSettings
}

const extractVideoID = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : null
}

const buildEmbedURL = (videoId: string, settings?: VideoSettings): string => {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
  })

  if (settings?.autoplay) params.append('autoplay', '1')
  if (settings?.startTime) params.append('start', settings.startTime.toString())

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}

export const YoutubeEmbed: React.FC<Props> = ({
  className,
  videoURL,
  title,
  caption,
  settings,
}) => {
  const videoID = extractVideoID(videoURL)

  if (!videoID) {
    return (
      <div className="rounded-lg border-2 border-red-500 bg-red-100 p-4 text-red-700">
        Invalid YouTube URL
      </div>
    )
  }

  return (
    <div className={cn('mx-auto my-8 max-w-xl space-y-4', className)}>
      <div className="w-full overflow-hidden rounded-xl border-2 border-gray-300 bg-gray-100 dark:border-gray-400 dark:bg-gray-800">
        <div className="relative pb-[56.25%]">
          <iframe
            className="absolute inset-0 h-full w-full"
            src={buildEmbedURL(videoID, settings)}
            title={title || 'YouTube video player'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
      {caption && (
        <div className="mx-auto max-w-2xl text-center text-sm text-gray-600 dark:text-gray-400">
          <RichText data={JSON.parse(caption)} enableGutter={false} />
        </div>
      )}
    </div>
  )
}
