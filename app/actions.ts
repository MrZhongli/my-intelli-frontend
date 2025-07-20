// app/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createSession, deleteSession } from '@/lib/session'
import { apiClient } from '@/lib/api-clients'
import type {
  Author,
  Book,
  CreateAuthorDto,
  UpdateAuthorDto,
  CreateBookDto,
  UpdateBookDto,
  User,
} from '@/lib/types'

// Auth Actions
export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  // Fetch all users and validate credentials
  const users = await apiClient.getUsers()
  const user = users.find(
    (u: User) => u.username === username && u.password === password && u.isActive
  )

  if (!user) {
    return { error: 'Invalid credentials or inactive user' }
  }

  await createSession(user.id)
  redirect('/authors')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}

// Author Actions
export async function getAuthorsAction(): Promise<Author[]> {
  try {
    return await apiClient.getAuthors()
  } catch (error) {
    console.error('Failed to fetch authors:', error)
    return []
  }
}

export async function createAuthorAction(formData: FormData) {
  try {
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string

    if (!firstName || !lastName) {
      return { error: 'First name and last name are required.' }
    }

    const authorData: CreateAuthorDto = { firstName, lastName }

    await apiClient.createAuthor(authorData)
    revalidatePath('/authors')
    revalidatePath('/books')

    return { success: true }
  } catch (error) {
    console.error('Failed to create author:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create author',
    }
  }
}

export async function updateAuthorAction(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string

    if (!id || !firstName || !lastName) {
      return { error: 'ID, first name, and last name are required.' }
    }

    const authorData: UpdateAuthorDto = { firstName, lastName }

    await apiClient.updateAuthor(id, authorData)
    revalidatePath('/authors')
    revalidatePath('/books')

    return { success: true }
  } catch (error) {
    console.error('Failed to update author:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update author',
    }
  }
}

export async function deleteAuthorAction(id: string) {
  try {
    await apiClient.deleteAuthor(id)
    revalidatePath('/authors')
    revalidatePath('/books')

    return { success: true }
  } catch (error) {
    console.error('Failed to delete author:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete author',
    }
  }
}

// Book Actions
export async function getBooksAction(): Promise<Book[]> {
  try {
    return await apiClient.getBooks()
  } catch (error) {
    console.error('Failed to fetch books:', error)
    return []
  }
}

export async function createBookAction(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const isbn = formData.get('isbn') as string
    const description = formData.get('description') as string
    const authorId = formData.get('authorId') as string

    if (!title || !authorId) {
      return { error: 'Title and author are required.' }
    }

    const bookData: CreateBookDto = {
      title,
      authorId,
      ...(isbn && { isbn }),
      ...(description && { description }),
    }

    await apiClient.createBook(bookData)
    revalidatePath('/books')
    revalidatePath('/authors')

    return { success: true }
  } catch (error) {
    console.error('Failed to create book:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to create book',
    }
  }
}

export async function updateBookAction(formData: FormData) {
  try {
    const id = formData.get('id') as string
    const title = formData.get('title') as string
    const isbn = formData.get('isbn') as string
    const description = formData.get('description') as string
    const authorId = formData.get('authorId') as string

    if (!id || !title || !authorId) {
      return { error: 'ID, title, and author are required.' }
    }

    const bookData: UpdateBookDto = {
      title,
      authorId,
      ...(isbn && { isbn }),
      ...(description && { description }),
    }

    await apiClient.updateBook(id, bookData)
    revalidatePath('/books')
    revalidatePath('/authors')

    return { success: true }
  } catch (error) {
    console.error('Failed to update book:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to update book',
    }
  }
}

export async function deleteBookAction(id: string) {
  try {
    await apiClient.deleteBook(id)
    revalidatePath('/books')
    revalidatePath('/authors')

    return { success: true }
  } catch (error) {
    console.error('Failed to delete book:', error)
    return {
      error: error instanceof Error ? error.message : 'Failed to delete book',
    }
  }
}
