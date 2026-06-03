"use client"

import { useState } from "react"
import { convertQuantity, getAvailableUnits, calculatePrice } from "@/lib/units"
import { createOrder, OrderItemInput } from "@/actions/orders"
import { Product } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function QuotationBuilder({ products }: { products: Product[] }) {
  const router = useRouter()
  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [unit, setUnit] = useState<string>("")
  const [cart, setCart] = useState<(OrderItemInput & { product: Product })[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)

  const activeProduct = products.find(p => p.id === selectedProduct)
  const availableUnits = activeProduct ? getAvailableUnits(activeProduct.dimension) : []

  const handleAddToCart = () => {
    if (!activeProduct || !unit || quantity <= 0) return

    try {
      const price = calculatePrice(quantity, unit, Number(activeProduct.basePrice), activeProduct.baseUnit)
      const baseQty = convertQuantity(quantity, unit, activeProduct.baseUnit)
      
      setCart([...cart, {
        productId: activeProduct.id,
        product: activeProduct,
        orderedQuantity: quantity,
        orderedUnit: unit,
        baseQuantity: baseQty,
        calculatedPrice: price
      }])
      
      // Reset form
      setSelectedProduct("")
      setQuantity(1)
      setUnit("")
      toast.success("Added to quotation")
    } catch (e) {
      toast.error("Failed to calculate price due to invalid units")
    }
  }

  const handleRemove = (index: number) => {
    setCart(cart.filter((_, i) => i !== index))
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.calculatedPrice, 0)

  const handleSubmitQuotation = async () => {
    if (cart.length === 0) return
    setIsSubmitting(true)
    
    try {
      await createOrder(cart, totalAmount)
      toast.success("Quotation submitted successfully!")
      setCart([])
      router.refresh()
    } catch (e) {
      toast.error("Failed to submit quotation")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-12">
      <div className="md:col-span-5 space-y-6 rounded-xl border bg-card p-6">
        <div>
          <h2 className="text-lg font-semibold">Select Product</h2>
          <p className="text-sm text-muted-foreground">Add items to your quotation</p>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product</label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between h-10 rounded-lg border-2 border-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)] bg-background px-3 py-1 font-normal"
                >
                  {selectedProduct
                    ? products.find((p) => p.id === selectedProduct)?.name
                    : "Select a product..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-2 border-foreground shadow-[4px_4px_0px_0px_var(--color-foreground)]" align="start">
                <Command>
                  <CommandInput placeholder="Search product..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No product found.</CommandEmpty>
                    <CommandGroup>
                      {products.map((p) => (
                        <CommandItem
                          key={p.id}
                          value={p.id}
                          onSelect={(currentValue) => {
                            setSelectedProduct(currentValue === selectedProduct ? "" : currentValue)
                            setOpen(false)
                            const prod = products.find(prod => prod.id === currentValue)
                            if (prod) setUnit(getAvailableUnits(prod.dimension)[0] || "")
                          }}
                        >
                          {p.name}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedProduct === p.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <Input 
                type="number" 
                min="0.1" 
                step="any" 
                value={quantity} 
                onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)} 
                disabled={!selectedProduct}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unit</label>
              <Select 
                value={unit} 
                onValueChange={(val) => setUnit(val || "")} 
                disabled={!selectedProduct || availableUnits.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map(u => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeProduct && unit && quantity > 0 && (
            <div className="rounded-lg bg-muted p-4 space-y-1">
              <div className="text-sm text-muted-foreground">Estimated Price</div>
              <div className="text-2xl font-bold">
                ₹{calculatePrice(quantity, unit, Number(activeProduct.basePrice), activeProduct.baseUnit)}
              </div>
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={handleAddToCart}
            disabled={!selectedProduct || quantity <= 0 || !unit}
          >
            Add to Quotation
          </Button>
        </div>
      </div>

      <div className="md:col-span-7 space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Current Quotation</h2>
          <p className="text-sm text-muted-foreground">Review and submit</p>
        </div>

        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="font-medium">{item.product.name}</div>
                    <div className="text-xs text-muted-foreground">{item.product.hazardClass}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.orderedQuantity} {item.orderedUnit}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ₹{item.calculatedPrice}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleRemove(i)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {cart.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No items in quotation.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {cart.length > 0 && (
            <div className="border-t p-6">
              <div className="flex items-center justify-between font-semibold text-lg mb-4">
                <span>Total Amount:</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
              <Button 
                className="w-full" 
                size="lg" 
                onClick={handleSubmitQuotation}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Quotation Request"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
