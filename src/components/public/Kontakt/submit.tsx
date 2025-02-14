'use server'
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

export async function submitContactForm(formData: {
  name: string
  email: string
  message: string
}) {
  try {
    const contact = await payload.create({
      collection: 'kontakt',
      data: {
        name: formData.name,
        email: formData.email,
        message: formData.message,
      },
    })

    return {
      success: true,
      data: contact,
    }
  } catch (error) {
    console.error('Contact form submission failed:', error)
    return {
      success: false,
      error: 'Došlo je do greške prilikom slanja poruke. Pokušajte ponovo.',
    }
  }
}
