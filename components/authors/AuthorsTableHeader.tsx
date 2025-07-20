// components/authors/AuthorsTableHeader.tsx
"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle, Download } from "lucide-react"
import { DialogTrigger } from "@/components/ui/dialog"

interface AuthorsTableHeaderProps {
    isLoading: boolean
    onExport: () => void
    onAddClick: () => void
}

export function AuthorsTableHeader({
    isLoading,
    onExport,
    onAddClick
}: AuthorsTableHeaderProps) {
    return (
        <div className="flex items-center justify-between p-6">
            <h2 className="text-xl font-semibold">Authors List</h2>
            <div className="flex gap-2">
                <DialogTrigger asChild>
                    <Button size="sm" disabled={isLoading} onClick={onAddClick}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Author
                    </Button>
                </DialogTrigger>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={onExport}
                    disabled={isLoading}
                >
                    <Download className="mr-2 h-4 w-4" />
                    {isLoading ? "Exporting..." : "Export Excel"}
                </Button>
            </div>
        </div>
    )
}