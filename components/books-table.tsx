"use client"

import { useState } from "react"
import type { Book, Author } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createBookAction,
  updateBookAction,
  deleteBookAction,
} from "@/app/actions"
import { toast } from "sonner"
import { Trash2, Pencil, PlusCircle, Download } from "lucide-react"
import { apiClient } from "@/lib/api-clients"

interface BooksTableProps {
  initialBooks: Book[]
  authors: Author[]
}

export function BooksTable({ initialBooks, authors }: BooksTableProps) {
  const [books, setBooks] = useState(initialBooks)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentBook, setCurrentBook] = useState<Book | null>(null)
  const [selectedAuthorId, setSelectedAuthorId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAddBook = async (formData: FormData) => {
    if (!selectedAuthorId) {
      toast.error("Please select an author.")
      return
    }
    formData.set("authorId", selectedAuthorId)
    setIsLoading(true)
    try {
      const result = await createBookAction(formData)
      if (result.success) {
        toast.success("Book added successfully.")
        setIsAddDialogOpen(false)
        setSelectedAuthorId("")
        const updatedBooks = await apiClient.getBooks()
        setBooks(updatedBooks)
      } else {
        toast.error("Failed to add book.", { description: result.error })
      }
    } catch {
      toast.error("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditBook = async (formData: FormData) => {
    const authorIdToUse = selectedAuthorId || currentBook?.authorId
    if (!authorIdToUse) {
      toast.error("Please select an author.")
      return
    }
    formData.set("authorId", authorIdToUse)
    setIsLoading(true)
    try {
      const result = await updateBookAction(formData)
      if (result.success) {
        toast.success("Book updated successfully.")
        setIsEditDialogOpen(false)
        setSelectedAuthorId("")
        const updatedBooks = await apiClient.getBooks()
        setBooks(updatedBooks)
      } else {
        toast.error("Failed to update book.", { description: result.error })
      }
    } catch {
      toast.error("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteBook = async (id: string, title: string) => {
    if (
      confirm(`Are you sure you want to delete the book "${title}"?`)
    ) {
      setIsLoading(true)
      try {
        const result = await deleteBookAction(id)
        if (result.success) {
          setBooks((b) => b.filter((bk) => bk.id !== id))
          toast.success("Book deleted successfully.")
        } else {
          toast.error("Failed to delete book.", { description: result.error })
        }
      } catch {
        toast.error("An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleExportBooks = async () => {
    setIsLoading(true)
    try {
      const blob = await apiClient.exportBooksExcel()
      await apiClient.downloadFile(blob, "books.xlsx")
      toast.success("Books exported successfully.")
    } catch {
      toast.error("Failed to export books.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportCombined = async () => {
    setIsLoading(true)
    try {
      const blob = await apiClient.exportCombinedExcel()
      await apiClient.downloadFile(blob, "library_data.xlsx")
      toast.success("Combined data exported successfully.")
    } catch {
      toast.error("Failed to export combined data.")
    } finally {
      setIsLoading(false)
    }
  }

  const getAuthorName = (authorId: string) => {
    const a = authors.find((x) => x.id === authorId)
    return a
      ? `${a.firstName} ${a.lastName}`.trim()
      : "Unknown Author"
  }

  const resetDialogState = () => {
    setSelectedAuthorId("")
    setCurrentBook(null)
  }

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between p-6">
        <h2 className="text-xl font-semibold">Books List</h2>
        <div className="flex gap-2">
          {/* Add Book */}
          <Dialog
            open={isAddDialogOpen}
            onOpenChange={(open) => {
              setIsAddDialogOpen(open)
              if (!open) resetDialogState()
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" disabled={isLoading}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
                <DialogDescription>
                  Enter the details for the new book.
                </DialogDescription>
              </DialogHeader>
              <form
                action={handleAddBook}
                className="grid gap-4 py-4"
              >
                {/* Title */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    className="col-span-3"
                    required
                    disabled={isLoading}
                  />
                </div>
                {/* ISBN */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isbn" className="text-right">
                    ISBN
                  </Label>
                  <Input
                    id="isbn"
                    name="isbn"
                    className="col-span-3"
                    disabled={isLoading}
                  />
                </div>
                {/* Description */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    className="col-span-3"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
                {/* Author Select */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="author" className="text-right">
                    Author
                  </Label>
                  <Select
                    onValueChange={setSelectedAuthorId}
                    value={selectedAuthorId}
                  >
                    <SelectTrigger id="author" className="col-span-3">
                      <SelectValue placeholder="Select an author" />
                    </SelectTrigger>
                    <SelectContent>
                      {authors.map((a) => (
                        <SelectItem key={a.id} value={a.id}>
                          {a.firstName} {a.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Book"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* Export Buttons */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportBooks}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? "Exporting..." : "Export Books"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleExportCombined}
            disabled={isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isLoading ? "Exporting..." : "Export Combined"}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead>Author</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No books found.
              </TableCell>
            </TableRow>
          ) : (
            books.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.isbn || "—"}</TableCell>
                <TableCell>{getAuthorName(book.authorId)}</TableCell>
                <TableCell className="text-right space-x-2">
                  {/* Edit Book */}
                  <Dialog
                    open={isEditDialogOpen && currentBook?.id === book.id}
                    onOpenChange={(open) => {
                      setIsEditDialogOpen(open)
                      if (!open) resetDialogState()
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentBook(book)
                          setSelectedAuthorId(book.authorId)
                          setIsEditDialogOpen(true)
                        }}
                        aria-label={`Edit ${book.title}`}
                        disabled={isLoading}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Book</DialogTitle>
                        <DialogDescription>
                          Update the book details.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        action={handleEditBook}
                        className="grid gap-4 py-4"
                      >
                        <input
                          type="hidden"
                          name="id"
                          value={currentBook?.id}
                        />
                        {/* Title */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="edit-title"
                            name="title"
                            defaultValue={currentBook?.title}
                            className="col-span-3"
                            required
                            disabled={isLoading}
                          />
                        </div>
                        {/* ISBN */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-isbn" className="text-right">
                            ISBN
                          </Label>
                          <Input
                            id="edit-isbn"
                            name="isbn"
                            defaultValue={currentBook?.isbn || ""}
                            className="col-span-3"
                            disabled={isLoading}
                          />
                        </div>
                        {/* Description */}
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label htmlFor="edit-description" className="text-right pt-2">
                            Description
                          </Label>
                          <Textarea
                            id="edit-description"
                            name="description"
                            defaultValue={currentBook?.description || ""}
                            className="col-span-3"
                            rows={3}
                            disabled={isLoading}
                          />
                        </div>
                        {/* Author */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-author" className="text-right">
                            Author
                          </Label>
                          <Select
                            onValueChange={setSelectedAuthorId}
                            value={selectedAuthorId}
                          >
                            <SelectTrigger id="edit-author" className="col-span-3">
                              <SelectValue placeholder="Select an author" />
                            </SelectTrigger>
                            <SelectContent>
                              {authors.map((a) => (
                                <SelectItem key={a.id} value={a.id}>
                                  {a.firstName} {a.lastName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Changes"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Book */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleDeleteBook(book.id, book.title)
                    }
                    aria-label={`Delete ${book.title}`}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
