interface EmailPayload {
  to: string
  subject: string
  html: string
}
//FIXME: napravi da radi sa pravim mejlom
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Log email for testing
    console.log('Sending email:', {
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      timestamp: new Date().toISOString(),
    })

    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}
