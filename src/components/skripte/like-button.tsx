'use client'

import { ArrowUpIcon } from 'lucide-react'
import { useOptimistic as useOptimistic } from 'react'
import type { FileStat } from '@/components/skripte/file-utils'
import { cn } from '@/lib/utils/cn'

interface LikeButtonProps {
  file: FileStat
  likes: number
  isLiked: boolean
  onLike: (fileId: number) => Promise<void>
}
//FIXME: add user auth before using button
//maybe add component thats like dialog apears and says you need to login to use this feature
export function LikeButton({ file, likes, isLiked, onLike }: LikeButtonProps) {
  const [optimisticLiked, addOptimisticLike] = useOptimistic(isLiked)
  const [optimisticCount, addOptimisticCount] = useOptimistic(likes)

  return (
    <form
      action={async () => {
        addOptimisticLike(!optimisticLiked)
        addOptimisticCount(optimisticLiked ? optimisticCount - 1 : optimisticCount + 1)
        await onLike(file.props.fileid)
      }}
    >
      <button
        type="submit"
        className={cn(
          'flex items-center gap-1.5 px-2 py-1 rounded-md transition-colors text-sm',
          optimisticLiked
            ? 'text-blue-600 dark:text-blue-400 font-medium hover:bg-blue-100/50 dark:hover:bg-blue-900/40'
            : 'text-muted-foreground hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400',
        )}
      >
        <ArrowUpIcon
          className={cn(
            'size-4',
            optimisticLiked
              ? 'text-blue-500'
              : 'text-muted-foreground group-hover/like:text-blue-500',
          )}
        />
        <span>{optimisticCount}</span>
      </button>
    </form>
  )
}
