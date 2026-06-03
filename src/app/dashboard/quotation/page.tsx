import { getProducts } from "@/actions/products"
import { QuotationBuilder } from "@/components/QuotationBuilder"

export default async function QuotationPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Quotation</h1>
        <p className="text-muted-foreground">Select products and build an order request for approval.</p>
      </div>

      <QuotationBuilder products={products} />
    </div>
  )
}
