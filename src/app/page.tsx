import Link from "next/link"
import { Beaker, ArrowRight, ShieldCheck, Database, Zap } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Beaker className="size-5" />
            </div>
            AasaMedChem<span className="text-primary">.</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <Link href="/dashboard" className={buttonVariants({ variant: "default" })}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex" })}>
                  Log in
                </Link>
                <Link href="/register" className={buttonVariants({ variant: "default" })}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 xl:py-56">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Precision Inventory for <span className="text-primary">Modern Science</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  AasaMedChem provides an enterprise-grade platform for managing chemical inventory, tracking hazard classes, and dynamically converting scientific units on the fly.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link href={session ? "/dashboard" : "/register"} className={buttonVariants({ variant: "default", size: "lg", className: "h-12 px-8" })}>
                  {session ? "Go to Dashboard" : "Get Started"}
                  <ArrowRight className="ml-2 size-4" />
                </Link>
                <Link href="/login" className={buttonVariants({ variant: "outline", size: "lg", className: "h-12 px-8" })}>
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Zap className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Dynamic Unit Conversion</h3>
                <p className="text-muted-foreground">Order in liters, grams, or moles. Our system automatically converts and calculates pricing instantly based on base units.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <ShieldCheck className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Role-Based Access</h3>
                <p className="text-muted-foreground">Secure workflows with distinct permissions for Admins and Buyers. Full audit trails for every order placed.</p>
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                  <Database className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Edge-Ready Database</h3>
                <p className="text-muted-foreground">Powered by Neon PostgreSQL and Next.js Server Actions for lightning-fast, highly scalable database interactions.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row px-4 md:px-8">
          <p className="text-center text-sm leading-loose text-muted-foreground">
            Built for the AasaMedChem Hackathon.
          </p>
        </div>
      </footer>
    </div>
  )
}
