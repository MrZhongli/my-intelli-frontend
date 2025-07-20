// hooks/useAuthors.ts
"use client"

import { useState } from "react"
import { toast } from "sonner"
import type { Author } from "@/lib/types"
import { apiClient } from "@/lib/api-clients"
import { createAuthorAction, updateAuthorAction, deleteAuthorAction } from "@/app/actions"

export function useAuthors(initialAuthors: Author[]) {
    const [authors, setAuthors] = useState(initialAuthors)
    const [isLoading, setIsLoading] = useState(false)

    const refreshAuthors = async () => {
        try {
            const updatedAuthors = await apiClient.getAuthors()
            setAuthors(updatedAuthors)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("Failed to refresh authors list.")
        }
    }

    const handleCreateAuthor = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const result = await createAuthorAction(formData)
            if (result.success) {
                toast.success("Author added successfully.")
                await refreshAuthors()
                return true
            } else {
                toast.error("Failed to add author.", {
                    description: result.error
                })
                return false
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("An unexpected error occurred.")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpdateAuthor = async (formData: FormData) => {
        setIsLoading(true)
        try {
            const result = await updateAuthorAction(formData)
            if (result.success) {
                toast.success("Author updated successfully.")
                await refreshAuthors()
                return true
            } else {
                toast.error("Failed to update author.", {
                    description: result.error
                })
                return false
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error("An unexpected error occurred.")
            return false
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteAuthor = async (id: string, authorName: string) => {
        if (confirm(`Are you sure you want to delete ${authorName} and all their books?`)) {
            setIsLoading(true)
            try {
                const result = await deleteAuthorAction(id)
                if (result.success) {
                    setAuthors(authors.filter((author) => author.id !== id))
                    toast.success("Author deleted successfully.")
                } else {
                    toast.error("Failed to delete author.", {
                        description: result.error
                    })
                }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (error) {
                toast.error("An unexpected error occurred.")
            } finally {
                setIsLoading(false)
            }
        }
    }

    const handleExportAuthors = async () => {
        setIsLoading(true)
        try {
            console.log('Starting export...')
            const response = await apiClient.exportAuthorsExcel()

            if (!response.ok) {
                throw new Error(`Export failed: ${response.status} ${response.statusText}`)
            }

            const contentType = response.headers.get('content-type')
            if (!contentType?.includes('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') &&
                !contentType?.includes('application/vnd.ms-excel')) {
                console.warn('Unexpected content type:', contentType)
            }

            await apiClient.downloadFile(response, 'authors.xlsx')
            toast.success("Authors exported successfully.")
        } catch (error) {
            console.error('Export error:', error)

            if (error instanceof Error) {
                if (error.message.includes('NetworkError') || error.message.includes('CORS')) {
                    toast.error("Connection error. Please check if the server is running and CORS is configured.")
                } else if (error.message.includes('404')) {
                    toast.error("Export endpoint not found. Please check your backend configuration.")
                } else {
                    toast.error("Failed to export authors.", {
                        description: error.message
                    })
                }
            } else {
                toast.error("Failed to export authors.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return {
        authors,
        isLoading,
        handleCreateAuthor,
        handleUpdateAuthor,
        handleDeleteAuthor,
        handleExportAuthors,
    }
}