import { LoginForm } from "@/components/LoginForm"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Beaker } from "lucide-react"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Beaker className="size-4" />
            </div>
            AasaMedChem.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-primary text-primary-foreground lg:block">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-background/20 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center p-12 z-10">
          <div className="space-y-4 max-w-lg text-left">
            <h2 className="text-4xl font-bold tracking-tight">Streamlined Supply Chain.</h2>
            <p className="text-lg text-primary-foreground/80">
              Log in to manage your orders, track hazard class inventory, and dynamically convert units on the fly.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
