// src/app/api/webdav-test/route.ts
import { NextResponse } from 'next/server'
import { davClient } from '@/lib/utils/webdav'

export async function GET() {
  try {
    await davClient.exists('/')
    return NextResponse.json({ status: 'ok' })
  } catch (error: any) {
    console.error('WebDAV connection test failed:', error)
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 })
  }
}
