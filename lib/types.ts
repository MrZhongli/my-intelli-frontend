// lib/types.ts
export interface User {
    id: string
    email: string
    username: string
    password?: string 
    firstName?: string
    lastName?: string
    role: 'USER' | 'ADMIN'
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface Author {
    id: string
    firstName: string
    lastName: string
    booksCount: number
    createdAt: string
    updatedAt: string
    books?: Book[]
}

export interface Book {
    id: string
    title: string
    isbn?: string
    description?: string
    authorId: string
    createdAt: string
    updatedAt: string
    author?: Author
}

// DTOs for API requests
export interface CreateAuthorDto {
    firstName: string
    lastName: string
}

export interface UpdateAuthorDto {
    firstName?: string
    lastName?: string
}

export interface CreateBookDto {
    title: string
    isbn?: string
    description?: string
    authorId: string
}

export interface UpdateBookDto {
    title?: string
    isbn?: string
    description?: string
    authorId?: string
}

// API Response types
export interface ApiResponse<T> {
    data?: T
    error?: string
    message?: string
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
}

// lib/config.ts
export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    ENDPOINTS: {
        AUTHORS: '/authors',
        BOOKS: '/books',
        EXPORT: {
            COMBINED_EXCEL: '/export/combined/excel',
            AUTHORS_EXCEL: '/export/authors/excel',
            BOOKS_EXCEL: '/export/books/excel'
        }
    }
} as const

export const APP_CONFIG = {
    ITEMS_PER_PAGE: 10,
    SESSION_DURATION: 7 * 24 * 60 * 60 * 1000, // 7 days
} as const