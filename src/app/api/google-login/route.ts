import { NextResponse } from 'next/server'
import payload from 'payload'

export async function POST(request: Request) {
  try {
    const { googleToken } = await request.json()

    const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${googleToken}` },
    }).then((res) => res.json())

    const { email, sub: googleId, name } = userInfo

    // Find or create user
    const user = await payload.find({
      collection: 'site-users',
      where: { googleId: { equals: googleId } },
    })

    if (!user.docs.length) {
      const newUser = await payload.create({
        collection: 'site-users',
        data: {
          email,
          name,
          googleId,
          emailVerified: new Date().toISOString(),
          linkedAccounts: [{ provider: 'google', providerId: googleId }],
        },
      })
      user.docs.push(newUser)
    }
    function generateRandomPassword() {
      return Math.random().toString(36).slice(-8)
    }
    // Login and get token
    const { token } = await payload.login({
      collection: 'site-users',
      data: { email, password: generateRandomPassword() },
    })

    return NextResponse.json({ token, user })
  } catch (error) {
    console.error('Google login error:', error)
    return NextResponse.error()
  }
}
