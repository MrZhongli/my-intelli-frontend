// lib/api-client.ts
import { API_CONFIG } from './config'
import type {
    Author,
    Book,
    CreateAuthorDto,
    UpdateAuthorDto,
    CreateBookDto,
    UpdateBookDto,
    User,
} from './types'

class ApiClient {
    private baseUrl: string

    constructor() {
        // 1. Normalizamos la base URL: quitamos cualquier slash al final
        this.baseUrl = API_CONFIG.BASE_URL.replace(/\/+$/, '')
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        // 2. Siempre aseguramos un único slash al unir baseUrl y endpoint
        const safeEndpoint = endpoint.startsWith('/')
            ? endpoint
            : `/${endpoint}`

        const url = `${this.baseUrl}${safeEndpoint}`

        const config: RequestInit = {
            credentials: 'include',              // 3. enviamos cookies de sesión
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        }

        try {
            const response = await fetch(url, config)

            if (!response.ok) {
                const errorData = await response.json().catch(() => null)
                throw new Error(
                    errorData?.message ||
                    `HTTP ${response.status}: ${response.statusText}`
                )
            }

            // 4. Para endpoints de export devolvemos directamente el Response
            if (safeEndpoint.includes('export') && safeEndpoint.includes('excel')) {
                return response as unknown as T
            }

            return (await response.json()) as T
        } catch (error) {
            console.error('API Request failed:', error)
            throw error
        }
    }


    // — Users API —
    async getUsers(): Promise<User[]> {
        return this.request<User[]>(API_CONFIG.ENDPOINTS.USERS)
    }
    async getUserById(id: string): Promise<User> {
        return this.request<User>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`)
    }

    // — Authors API —
    async getAuthors(): Promise<Author[]> {
        return this.request<Author[]>(API_CONFIG.ENDPOINTS.AUTHORS)
    }
    async getAuthorById(id: string): Promise<Author> {
        return this.request<Author>(
            `${API_CONFIG.ENDPOINTS.AUTHORS}/${id}`
        )
    }
    async createAuthor(data: CreateAuthorDto): Promise<Author> {
        return this.request<Author>(API_CONFIG.ENDPOINTS.AUTHORS, {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }
    async updateAuthor(id: string, data: UpdateAuthorDto): Promise<Author> {
        return this.request<Author>(
            `${API_CONFIG.ENDPOINTS.AUTHORS}/${id}`,
            { method: 'PATCH', body: JSON.stringify(data) }
        )
    }
    async deleteAuthor(id: string): Promise<void> {
        return this.request<void>(
            `${API_CONFIG.ENDPOINTS.AUTHORS}/${id}`,
            { method: 'DELETE' }
        )
    }

    // — Books API —
    async getBooks(): Promise<Book[]> {
        return this.request<Book[]>(API_CONFIG.ENDPOINTS.BOOKS)
    }
    async getBookById(id: string): Promise<Book> {
        return this.request<Book>(
            `${API_CONFIG.ENDPOINTS.BOOKS}/${id}`
        )
    }
    async createBook(data: CreateBookDto): Promise<Book> {
        return this.request<Book>(API_CONFIG.ENDPOINTS.BOOKS, {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }
    async updateBook(id: string, data: UpdateBookDto): Promise<Book> {
        return this.request<Book>(
            `${API_CONFIG.ENDPOINTS.BOOKS}/${id}`,
            { method: 'PATCH', body: JSON.stringify(data) }
        )
    }
    async deleteBook(id: string): Promise<void> {
        return this.request<void>(
            `${API_CONFIG.ENDPOINTS.BOOKS}/${id}`,
            { method: 'DELETE' }
        )
    }

    // — Export API —
    async exportCombinedExcel(): Promise<Response> {
        return this.request<Response>(
            API_CONFIG.ENDPOINTS.EXPORT.COMBINED_EXCEL
        )
    }
    async exportAuthorsExcel(): Promise<Response> {
        return this.request<Response>(
            API_CONFIG.ENDPOINTS.EXPORT.AUTHORS_EXCEL
        )
    }
    async exportBooksExcel(): Promise<Response> {
        return this.request<Response>(
            API_CONFIG.ENDPOINTS.EXPORT.BOOKS_EXCEL
        )
    }

    // Helper para descargar archivos
    async downloadFile(
        response: Response,
        filename: string
    ): Promise<void> {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    }
}

export const apiClient = new ApiClient()
