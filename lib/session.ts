// lib/session.ts
import { cookies as _cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE_NAME = 'session_user_id'

async function getCookieStore() {
  // cookies() is async in App Router contexts
  return await _cookies()
}

export async function setSession(userId: string) {
  const cookieStore = await getCookieStore()
  cookieStore.set({
    name: COOKIE_NAME,
    value: userId,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function clearSession() {
  const cookieStore = await getCookieStore()
  cookieStore.delete(COOKIE_NAME)
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await getCookieStore()
  return Boolean(cookieStore.get(COOKIE_NAME)?.value)
}

export async function getCurrentUser() {
  const cookieStore = await getCookieStore()
  const userId = cookieStore.get(COOKIE_NAME)?.value
  if (!userId) return null

  const res = await fetch(`${process.env.API_URL}/users/${userId}`, {
    credentials: 'include',
  })
  if (!res.ok) return null
  return res.json()
}

export async function requireAuth() {
  if (!(await isAuthenticated())) {
    redirect('/login')
  }
}

// aliases for compatibility
export const createSession = setSession
export const deleteSession = clearSession
