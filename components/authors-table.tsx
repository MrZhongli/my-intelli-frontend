// components/authors-table.tsx
"use client"

import { useState } from "react"
import type { Author } from "@/lib/types"
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
import {
  createAuthorAction,
  updateAuthorAction,
  deleteAuthorAction,
} from "@/app/actions"
import { toast } from "sonner"
import { Trash2, Pencil, PlusCircle, Download } from "lucide-react"
import { apiClient } from "@/lib/api-clients"

interface AuthorsTableProps {
  initialAuthors: Author[]
}

export function AuthorsTable({ initialAuthors }: AuthorsTableProps) {
  const [authors, setAuthors] = useState(initialAuthors)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [current, setCurrent] = useState<Author | null>(null)
  const [loading, setLoading] = useState(false)

  const refresh = async () => {
    const updated = await apiClient.getAuthors()
    setAuthors(updated)
  }

  const handleAdd = async (formData: FormData) => {
    setLoading(true)
    const res = await createAuthorAction(formData)
    setLoading(false)
    if (res.success) {
      toast.success("Author added")
      setAddOpen(false)
      await refresh()
    } else {
      toast.error(res.error)
    }
  }

  const handleEdit = async (formData: FormData) => {
    setLoading(true)
    const res = await updateAuthorAction(formData)
    setLoading(false)
    if (res.success) {
      toast.success("Author updated")
      setEditOpen(false)
      await refresh()
    } else {
      toast.error(res.error)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return
    setLoading(true)
    const res = await deleteAuthorAction(id)
    setLoading(false)
    if (res.success) {
      toast.success("Author deleted")
      setAuthors(authors.filter((a) => a.id !== id))
    } else {
      toast.error(res.error)
    }
  }

  const handleExport = async () => {
    setLoading(true)
    const resp = await apiClient.exportAuthorsExcel()
    await apiClient.downloadFile(resp, "authors.xlsx")
    toast.success("Exported")
    setLoading(false)
  }

  const fullName = (a: Author) => `${a.firstName} ${a.lastName}`.trim()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-on-surface">List of Authors</h2>
        <div className="flex gap-2">
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-primary text-on-primary hover:bg-primary-dark"
                disabled={loading}
              >
                <PlusCircle className="text-white mr-1 h-4 w-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-white">Add Author</DialogTitle>
                <DialogDescription>Enter new author details.</DialogDescription>
              </DialogHeader>
              <form action={handleAdd} className="space-y-4 py-4">
                <div>
                  <Label htmlFor="firstName" className="sm:max-w-md py-3" >First Name</Label>
                  <Input id="firstName" name="firstName" disabled={loading} required />
                </div>
                <div>
                  <Label htmlFor="lastName" className="sm:max-w-md py-3">Last Name</Label>
                  <Input id="lastName" name="lastName" disabled={loading} required />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Button
            size="sm"
            variant="outline"
            onClick={handleExport}
            disabled={loading}
          >
            <Download className="mr-1 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Table className="bg-surface dark:bg-surface-variant">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right"># Books Counter</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-on-surface-light">
                No authors yet.
              </TableCell>
            </TableRow>
          ) : (
            authors.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium text-on-surface">
                  {fullName(a)}
                </TableCell>
                <TableCell className="text-right text-on-surface-light">
                  {a.booksCount}
                </TableCell>
                <TableCell className="text-right">
                  <Dialog open={editOpen && current?.id === a.id} onOpenChange={setEditOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCurrent(a) || setEditOpen(true)}
                        disabled={loading}
                        className="text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Author</DialogTitle>
                        <DialogDescription>Update author details.</DialogDescription>
                      </DialogHeader>
                      <form action={handleEdit} className="space-y-4 py-4">
                        <input type="hidden" name="id" value={current?.id} />
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            defaultValue={current?.firstName}
                            disabled={loading}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            defaultValue={current?.lastName}
                            disabled={loading}
                            required
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(a.id, fullName(a))}
                    disabled={loading}
                    className="text-secondary-dark"
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
