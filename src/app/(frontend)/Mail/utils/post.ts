'use server'
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

export async function subscribeToNewsletter(
  email: string,
  years: number[],
  subscribeToBoard: boolean,
) {
  try {
    const subscription = await payload.create({
      collection: 'Newsletter',
      data: {
        email,
        subscription: years.map((year) => `y${year}` as 'y1' | 'y2' | 'y3' | 'y4'),
        subscribeToBoard,
      },
    })
    return { success: true, data: subscription }
  } catch (error: any) {
    console.error('Failed to subscribe:', error)

    if (error.name === 'ValidationError') {
      return {
        success: false,
        warn: 'Email adresa je već prijavljena na newsletter.',
      }
    }

    return {
      success: false,
      error: 'Došlo je do greške prilikom prijave. Pokušajte ponovo.',
    }
  }
}
