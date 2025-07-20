// app/login/page.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/app/actions"
import { isAuthenticated } from "@/lib/session"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  if (await isAuthenticated()) redirect("/authors")

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-light dark:bg-bg-dark">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-surface p-8 shadow-lg dark:bg-surface-variant">
        <div className="space-y-1 text-center">
          <h1 className="text-3xl font-semibold text-primary">MyIntelli Test App</h1>
          <p className="text-on-surface-light">Sign in to continue</p>
        </div>
        <form action={login} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-on-surface">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="alice_w"
              required
              type="text"
              className="mt-1 w-full border-on-surface-light focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-on-surface">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="mt-1 w-full border-on-surface-light focus:border-primary focus:ring-primary"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-primary text-white hover:bg-primary-dark focus:ring-primary"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  )
}
