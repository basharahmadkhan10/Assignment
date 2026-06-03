import { getProducts, deleteProduct } from "@/actions/products"
import { CreateProductDialog } from "@/components/CreateProductDialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function InventoryPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage your product catalog and stock levels.</p>
        </div>
        <CreateProductDialog />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Dimension</TableHead>
              <TableHead>Base Unit</TableHead>
              <TableHead className="text-right">Price (INR)</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Hazard</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  {product.name}
                  {product.storageCondition && (
                    <p className="text-xs text-muted-foreground">{product.storageCondition}</p>
                  )}
                </TableCell>
                <TableCell>{product.dimension}</TableCell>
                <TableCell>{product.baseUnit}</TableCell>
                <TableCell className="text-right">{product.basePrice.toString()}</TableCell>
                <TableCell className="text-right">{product.stockQuantity.toString()}</TableCell>
                <TableCell>
                  {product.hazardClass && product.hazardClass !== "NONE" ? (
                    <Badge variant="destructive" className="text-[10px]">
                      {product.hazardClass}
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-[10px]">NONE</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
