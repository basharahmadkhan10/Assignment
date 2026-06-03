"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateProduct, ProductUpdateData } from "@/actions/products"
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
import { toast } from "sonner"
import { Edit } from "lucide-react"
import { Product } from "@prisma/client"

export function UpdateProductDialog({ product }: { product: Product }) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const data: ProductUpdateData = {
      basePrice: parseFloat(formData.get("basePrice") as string),
      stockQuantity: parseFloat(formData.get("stockQuantity") as string),
    }

    try {
      await updateProduct(product.id, data)
      toast.success("Inventory updated successfully")
      setOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Failed to update inventory")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Edit className="size-4" />
          Update
        </Button>
      } />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Inventory: {product.name}</DialogTitle>
          <DialogDescription>
            Update the base price and available stock quantity for this product.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="basePrice">Base Price (INR per {product.baseUnit})</Label>
              <Input id="basePrice" name="basePrice" type="number" step="0.01" min="0" defaultValue={product.basePrice.toString()} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="stockQuantity">Stock Quantity ({product.baseUnit})</Label>
              <Input id="stockQuantity" name="stockQuantity" type="number" step="any" min="0" defaultValue={product.stockQuantity.toString()} required />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
