import { Beaker } from "lucide-react"

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center p-8 border-4 border-foreground shadow-[8px_8px_0px_0px_var(--color-foreground)] bg-card">
        <div className="h-16 w-16 bg-primary flex items-center justify-center border-4 border-foreground mb-4 animate-bounce shadow-[4px_4px_0px_0px_var(--color-foreground)]">
          <Beaker className="size-8 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground animate-pulse">
          Processing...
        </h2>
        <p className="text-sm font-bold text-muted-foreground uppercase mt-2">
          AasaMedChem Core
        </p>
      </div>
    </div>
  )
}
