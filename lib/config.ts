export const API_CONFIG = {
    BASE_URL: 'http://localhost:8000', // Sin slash al final
    ENDPOINTS: {
        USERS: '/users',
        AUTHORS: '/authors',
        BOOKS: '/books',
        EXPORT: {
            COMBINED_EXCEL: '/export/combined/excel',
            AUTHORS_EXCEL: '/export/authors/excel',
            BOOKS_EXCEL: '/export/books/excel',
        },
    },
}