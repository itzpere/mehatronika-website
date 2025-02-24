// import { cookies } from 'next/headers'
// import { getPayload } from 'payload'
// import configPromise from '@payload-config'

// const COOKIE_NAME = 'likedFiles'

// const payload = await getPayload({
//   config: configPromise,
// })

// export async function getLikes(fileId: number) {
//   const file = await payload.find({
//     collection: 'files',
//     where: {
//       fileId: { equals: fileId },
//     },
//   })
//   return file.docs[0]?.likes || 0
// }

// export async function likeFile(fileId: number) {
//   'use server'

//   const cookieStore = await cookies()
//   const likedFiles = JSON.parse(cookieStore.get(COOKIE_NAME)?.value || '[]')
//   const isLiked = likedFiles.includes(fileId)

//   const existingFile = await payload.find({
//     collection: 'files',
//     where: { fileId: { equals: fileId } },
//   })

//   const currentLikes = existingFile.docs[0]?.likes || 0

//   if (isLiked) {
//     const newLikedFiles = likedFiles.filter((id: number) => id !== fileId)
//     cookieStore.set(COOKIE_NAME, JSON.stringify(newLikedFiles))

//     await payload.update({
//       collection: 'files',
//       where: { fileId: { equals: fileId } },
//       data: { likes: Math.max(currentLikes - 1, 0) },
//     })
//   } else {
//     likedFiles.push(fileId)
//     cookieStore.set(COOKIE_NAME, JSON.stringify(likedFiles))

//     await payload.update({
//       collection: 'files',
//       where: { fileId: { equals: fileId } },
//       data: { likes: currentLikes + 1 },
//     })
//   }
// }

// export async function getLikedFiles() {
//   const cookieStore = await cookies()
//   return JSON.parse(cookieStore.get(COOKIE_NAME)?.value || '[]')
// }
