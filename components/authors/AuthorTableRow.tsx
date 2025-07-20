// components/authors/AuthorTableRow.tsx
"use client"

import type { Author } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
import { Trash2, Pencil } from "lucide-react"

interface AuthorTableRowProps {
    author: Author
    isLoading: boolean
    onEdit: (author: Author) => void
    onDelete: (id: string, name: string) => void
}

export function AuthorTableRow({
    author,
    isLoading,
    onEdit,
    onDelete
}: AuthorTableRowProps) {
    const getFullName = (author: Author) => {
        return `${author.firstName} ${author.lastName}`.trim()
    }

    return (
        <TableRow>
            <TableCell className="font-medium">{getFullName(author)}</TableCell>
            <TableCell className="text-right">{author.booksCount}</TableCell>
            <TableCell className="text-right">
                <Button
                    variant="ghost"
                    size="icon"
                    className="mr-2"
                    onClick={() => onEdit(author)}
                    aria-label={`Edit ${getFullName(author)}`}
                    disabled={isLoading}
                >
                    <Pencil className="h-4 w-4" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(author.id, getFullName(author))}
                    aria-label={`Delete ${getFullName(author)}`}
                    disabled={isLoading}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    )
}