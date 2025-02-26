'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'

const payload = await getPayload({
  config: configPromise,
})

interface Like {
  betterAuthUserId: string
  createdAt: string // PayloadCMS stores dates as ISO strings
}

export async function getLikeStatus(userId: string, likes: Like[] = []) {
  if (!likes) return { likes: 0, isLiked: false }
  if (!userId) return { likes: likes.length, isLiked: false }
  try {
    return {
      likes: likes.length,
      isLiked: likes.some((like) => like.betterAuthUserId === userId),
    }
  } catch (error) {
    console.error('Error getting like status:', error)
    return { likes: 0, isLiked: false }
  }
}

export async function handleLike(fileUUID: number, userId: string) {
  if (!userId || !fileUUID) return { likes: 0, isLiked: false }

  try {
    // Find the file by UUID
    const fileResult = await payload.find({
      collection: 'files',
      where: {
        uuid: {
          equals: fileUUID,
        },
      },
    })

    if (!fileResult.docs.length) {
      throw new Error(`File with UUID ${fileUUID} not found`)
    }

    const file = fileResult.docs[0]
    const likes = file.likes || []

    // Check if user already liked this file
    const existingLikeIndex = likes.findIndex((like) => like.likeBetterAuthUserId === userId)
    const isLiked = existingLikeIndex >= 0

    // Toggle like status
    let updatedLikes
    if (isLiked) {
      // Remove like
      updatedLikes = likes.filter((like) => like.likeBetterAuthUserId !== userId)
    } else {
      // Add like
      updatedLikes = [
        ...likes,
        {
          likeBetterAuthUserId: userId,
          createdAt: new Date().toISOString(),
        },
      ]
    }

    // Update the file with new likes array
    await payload.update({
      collection: 'files',
      id: file.id,
      data: {
        likes: updatedLikes,
      },
    })

    return {
      likes: updatedLikes.length,
      isLiked: !isLiked,
    }
  } catch (error) {
    console.error('Error handling like:', error)
    return { likes: 0, isLiked: false }
  }
}
