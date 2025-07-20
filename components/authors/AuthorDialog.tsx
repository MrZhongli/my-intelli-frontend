// components/authors/AuthorDialog.tsx
"use client"

import type { Author } from "@/lib/types"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface AuthorDialogProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (formData: FormData) => Promise<boolean>
    isLoading: boolean
    author?: Author | null
    mode: 'create' | 'edit'
}

export function AuthorDialog({
    isOpen,
    onOpenChange,
    onSubmit,
    isLoading,
    author,
    mode
}: AuthorDialogProps) {
    const handleSubmit = async (formData: FormData) => {
        const success = await onSubmit(formData)
        if (success) {
            onOpenChange(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {mode === 'create' ? 'Add New Author' : 'Edit Author'}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === 'create'
                            ? 'Enter the details for the new author.'
                            : 'Make changes to the author details.'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    {mode === 'edit' && author && (
                        <input type="hidden" name="id" value={author.id} />
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="firstName" className="text-right">
                            First Name
                        </Label>
                        <Input
                            id="firstName"
                            name="firstName"
                            className="col-span-3"
                            required
                            disabled={isLoading}
                            defaultValue={author?.firstName || ''}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="lastName" className="text-right">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            name="lastName"
                            className="col-span-3"
                            required
                            disabled={isLoading}
                            defaultValue={author?.lastName || ''}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading
                                ? "Saving..."
                                : mode === 'create'
                                    ? "Save Author"
                                    : "Save Changes"
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}