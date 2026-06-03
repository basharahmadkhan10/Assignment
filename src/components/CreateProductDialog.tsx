"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dimension, HazardClass } from "@prisma/client"
import { createProduct, ProductCreateData } from "@/actions/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { getAvailableUnits } from "@/lib/units"

export function CreateProductDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [dimension, setDimension] = useState<Dimension>("WEIGHT")
  const availableUnits = getAvailableUnits(dimension)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const data: ProductCreateData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      dimension: dimension,
      baseUnit: formData.get("baseUnit") as string,
      basePrice: parseFloat(formData.get("basePrice") as string),
      stockQuantity: parseFloat(formData.get("stockQuantity") as string),
      storageCondition: formData.get("storageCondition") as string,
      hazardClass: (formData.get("hazardClass") as HazardClass) || undefined,
    }

    try {
      await createProduct(data)
      toast.success("Product created successfully")
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Failed to create product")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Add New Product</Button>} />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Enter the details for the new product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Acetone" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input id="description" name="description" placeholder="Short description..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="dimension">Dimension</Label>
              <Select 
                name="dimension" 
                value={dimension} 
                onValueChange={(val) => setDimension(val as Dimension)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WEIGHT">Weight</SelectItem>
                  <SelectItem value="VOLUME">Volume</SelectItem>
                  <SelectItem value="COUNT">Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="baseUnit">Base Unit</Label>
              <Select name="baseUnit" defaultValue={availableUnits[0]}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit..." />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="basePrice">Base Price (INR)</Label>
              <Input id="basePrice" name="basePrice" type="number" step="0.01" min="0" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input id="stockQuantity" name="stockQuantity" type="number" step="any" min="0" required />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="storageCondition">Storage Condition (optional)</Label>
            <Input id="storageCondition" name="storageCondition" placeholder="e.g. Refrigerated" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="hazardClass">Hazard Class</Label>
            <Select name="hazardClass">
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">None</SelectItem>
                <SelectItem value="FLAMMABLE">Flammable</SelectItem>
                <SelectItem value="CORROSIVE">Corrosive</SelectItem>
                <SelectItem value="TOXIC">Toxic</SelectItem>
                <SelectItem value="OXIDIZER">Oxidizer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
