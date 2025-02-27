'use client'

import { Heart, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/custom-toast'
import { cn } from '@/lib/utils/cn'
import { handleLike } from './likes'

interface LikeButtonProps {
  betterAuthUserID: string
  userUUID: number
  likes: number
  isLiked: boolean
}

export function LikeButton({
  betterAuthUserID,
  userUUID,
  likes: initialLikes,
  isLiked: initialIsLiked,
}: LikeButtonProps) {
  const router = useRouter()
  const [likeState, setLikeState] = useState({
    likes: initialLikes,
    isLiked: initialIsLiked,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [justLiked, setJustLiked] = useState(false)

  const onClick = async () => {
    if (!betterAuthUserID) {
      toast({
        title: 'Niste prijavljeni',
        description: 'Morate biti ulogovani da bi lajkovali fajlove',
        variant: 'error',
        action: {
          label: 'Prijavi se',
          onClick: () => router.push('/login'),
        },
      })
      return
    }

    // Optimistic update
    setLikeState((prev) => ({
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }))
    setIsLoading(true)

    try {
      const result = await handleLike(userUUID, betterAuthUserID)
      // Update with actual server response
      setLikeState(result)
    } catch (error) {
      // Revert to original state if error
      setLikeState({ likes: initialLikes, isLiked: initialIsLiked })
      console.error('Failed to update like', error)
    } finally {
      setIsLoading(false)
    }

    // Add animation trigger
    if (!likeState.isLiked) {
      setJustLiked(true)
      setTimeout(() => setJustLiked(false), 500)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'flex items-center gap-1.5 px-2 rounded-full transition-all duration-200',
        likeState.isLiked && 'bg-red-50/20 hover:bg-red-200/30 text-red-500',
        !likeState.isLiked && 'hover:bg-muted hover:text-red-400',
      )}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
      ) : (
        <Heart
          className={cn(
            'w-3.5 h-3.5 transition-all duration-200',
            likeState.isLiked
              ? 'fill-red-500 text-red-500'
              : 'text-muted-foreground hover:scale-110 group-hover:text-red-500',
            justLiked && 'scale-125 animate-heartbeat',
          )}
        />
      )}
      <span
        className={cn(
          'text-xs font-medium',
          likeState.isLiked ? 'text-red-500' : 'text-muted-foreground group-hover:text-red-500',
        )}
      >
        {likeState.likes}
      </span>
    </Button>
  )
}
