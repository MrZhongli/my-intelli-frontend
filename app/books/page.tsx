// app/books/page.tsx
import { requireAuth } from "@/lib/session"
import { getBooksAction, getAuthorsAction } from "@/app/actions"
import { BooksTable } from "@/components/books-table"
import { Header } from "@/components/header"

export default async function BooksPage() {
  await requireAuth()

  const books = await getBooksAction()
  const authors = await getAuthorsAction()

  return (
    <div className="flex min-h-screen flex-col bg-bg-light dark:bg-bg-dark">
      <Header />
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-semibold text-primary mb-6">Books</h1>
        <div className="rounded-2xl bg-surface p-6 shadow-md dark:bg-surface-variant">
          <BooksTable initialBooks={books} authors={authors} />
        </div>
      </main>
    </div>
  )
}
