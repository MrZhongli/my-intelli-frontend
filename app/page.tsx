import { redirect } from "next/navigation"
import { isAuthenticated } from "@/lib/session"

export default async function HomePage() {
  const authenticated = await isAuthenticated()

  if (authenticated) {
    redirect("/authors") // Redirect to authors if logged in
  } else {
    redirect("/login") // Redirect to login if not logged in
  }

  return null // This component will always redirect
}
