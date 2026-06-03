import { getProducts } from "@/actions/products"
import { CreateProductDialog } from "@/components/CreateProductDialog"
import { UpdateProductDialog } from "@/components/UpdateProductDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ProductFilters } from "@/components/ProductFilters"

export default async function InventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParams
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined
  const hazard = typeof resolvedParams.hazard === "string" ? resolvedParams.hazard : undefined

  const products = await getProducts({ search, hazard })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Inventory</h1>
          <p className="text-muted-foreground font-medium uppercase text-xs">Manage your product catalog and stock levels.</p>
        </div>
        <CreateProductDialog />
      </div>

      <ProductFilters />

      <div className="rounded-md border-4 border-foreground shadow-[8px_8px_0px_0px_var(--color-foreground)] overflow-hidden bg-card">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold uppercase">Name</TableHead>
              <TableHead className="font-bold uppercase">Dimension</TableHead>
              <TableHead className="font-bold uppercase">Base Unit</TableHead>
              <TableHead className="text-right font-bold uppercase">Price (INR)</TableHead>
              <TableHead className="text-right font-bold uppercase">Stock</TableHead>
              <TableHead className="font-bold uppercase">Hazard</TableHead>
              <TableHead className="text-right font-bold uppercase">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  {product.name}
                  {product.storageCondition && (
                    <p className="text-xs text-muted-foreground uppercase">{product.storageCondition}</p>
                  )}
                </TableCell>
                <TableCell className="uppercase text-xs font-bold">{product.dimension}</TableCell>
                <TableCell className="uppercase text-xs font-bold">{product.baseUnit}</TableCell>
                <TableCell className="text-right font-bold">₹{product.basePrice.toString()}</TableCell>
                <TableCell className="text-right font-bold">{product.stockQuantity.toString()}</TableCell>
                <TableCell>
                  {product.hazardClass && product.hazardClass !== "NONE" ? (
                    <Badge variant="destructive" className="text-[10px] rounded-none border-2 border-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                      {product.hazardClass}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px] rounded-none border-2 border-foreground">NONE</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <UpdateProductDialog product={product} />
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center font-bold uppercase text-muted-foreground">
                  No products found. Add a product to get started.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
