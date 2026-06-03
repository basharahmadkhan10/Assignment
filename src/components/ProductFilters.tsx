"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

export function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search")?.toString() || "")
  const currentHazard = searchParams.get("hazard")?.toString() || "ALL"

  // Debounce search so we don't spam the server on every keystroke
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`)
    })
  }, 300)

  const handleHazardChange = (val: string) => {
    const params = new URLSearchParams(searchParams)
    if (val && val !== "ALL") {
      params.set("hazard", val)
    } else {
      params.delete("hazard")
    }
    startTransition(() => {
      router.replace(`?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products by name..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            handleSearch(e.target.value)
          }}
        />
      </div>
      <div className="w-full md:w-[200px]">
        <Select value={currentHazard} onValueChange={handleHazardChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Hazard" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Hazards</SelectItem>
            <SelectItem value="NONE">None</SelectItem>
            <SelectItem value="FLAMMABLE">Flammable</SelectItem>
            <SelectItem value="TOXIC">Toxic</SelectItem>
            <SelectItem value="CORROSIVE">Corrosive</SelectItem>
            <SelectItem value="OXIDIZING">Oxidizing</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
