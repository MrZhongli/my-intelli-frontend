"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/actions"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6 dark:bg-gray-800">
      <nav className="flex items-center space-x-4">
        <Link
          className={`text-lg font-semibold ${pathname === "/authors" ? "text-primary" : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"}`}
          href="/authors"
        >
          Authors
        </Link>
        <Link
          className={`text-lg font-semibold ${pathname === "/books" ? "text-primary" : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"}`}
          href="/books"
        >
          Books
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <form action={logout}>
          <Button variant="outline" size="sm">
            Logout
          </Button>
        </form>
      </div>
    </header>
  )
}
