'use client'

import { ArrowUp } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/custom-toast'
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
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-1 px-2"
      onClick={onClick}
      disabled={isLoading}
    >
      <ArrowUp
        className={`w-4 h-4 ${likeState.isLiked ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
      />
      <span className="text-xs">{likeState.likes}</span>
    </Button>
  )
}
