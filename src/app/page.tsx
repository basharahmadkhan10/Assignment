import Link from "next/link"
import { Beaker, ArrowRight, ShieldCheck, Database, Zap, PackageSearch, Users } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="sticky top-0 z-50 w-full border-b-4 border-foreground bg-background">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter uppercase">
            <div className="flex h-8 w-8 items-center justify-center bg-primary border-2 border-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]">
              <Beaker className="size-5 text-primary-foreground" />
            </div>
            AasaMedChem
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <Link href="/dashboard" className={buttonVariants({ variant: "default", className: "border-2 border-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)] uppercase font-bold" })}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className={buttonVariants({ variant: "ghost", className: "hidden sm:inline-flex uppercase font-bold border-2 border-transparent hover:border-foreground" })}>
                  Log in
                </Link>
                <Link href="/register" className={buttonVariants({ variant: "default", className: "border-2 border-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)] uppercase font-bold" })}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 bg-primary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-6 max-w-4xl bg-background p-8 md:p-12 border-4 border-foreground shadow-[8px_8px_0px_0px_var(--color-foreground)]">
                <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl uppercase">
                  Precision Inventory for Modern Science
                </h1>
                <p className="mx-auto max-w-[700px] text-foreground font-medium md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  AasaMedChem provides an enterprise-grade platform for managing chemical inventory, tracking hazard classes, and dynamically converting scientific units on the fly.
                </p>
                <div className="flex flex-col gap-4 min-[400px]:flex-row justify-center pt-4">
                  <Link href={session ? "/dashboard" : "/register"} className={buttonVariants({ variant: "default", size: "lg", className: "h-14 px-8 text-lg uppercase font-black border-4 border-foreground shadow-[4px_4px_0px_0px_var(--color-foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--color-foreground)] transition-all" })}>
                    {session ? "Go to Dashboard" : "Enter Platform"}
                    <ArrowRight className="ml-2 size-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-20 bg-background border-y-4 border-foreground">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-black tracking-tighter uppercase mb-12 text-center">Platform Capabilities</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col bg-card border-4 border-foreground p-6 shadow-[6px_6px_0px_0px_var(--color-foreground)]">
                <div className="h-12 w-12 bg-primary flex items-center justify-center border-2 border-foreground mb-4">
                  <PackageSearch className="size-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold uppercase mb-2">Smart Inventory</h3>
                <p className="text-muted-foreground font-medium">Automatic unit conversions across Mass, Volume, and Item Count dimensions. Never miscalculate an order again.</p>
              </div>
              <div className="flex flex-col bg-card border-4 border-foreground p-6 shadow-[6px_6px_0px_0px_var(--color-foreground)]">
                <div className="h-12 w-12 bg-primary flex items-center justify-center border-2 border-foreground mb-4">
                  <ShieldCheck className="size-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold uppercase mb-2">Hazard Compliance</h3>
                <p className="text-muted-foreground font-medium">Built-in hazard classification tracking (Toxic, Flammable, Corrosive) and storage conditions management.</p>
              </div>
              <div className="flex flex-col bg-card border-4 border-foreground p-6 shadow-[6px_6px_0px_0px_var(--color-foreground)]">
                <div className="h-12 w-12 bg-primary flex items-center justify-center border-2 border-foreground mb-4">
                  <Users className="size-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold uppercase mb-2">Admin Authority</h3>
                <p className="text-muted-foreground font-medium">Absolute control over user management, instant order notifications, and quotation approvals via a dedicated panel.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t-4 border-foreground bg-primary py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-8">
          <p className="text-sm font-bold uppercase text-primary-foreground">
            © 2024 AasaMedChem. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
