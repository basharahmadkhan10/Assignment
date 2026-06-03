import { getOrders } from "@/actions/orders"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quotations & Orders</h1>
        <p className="text-muted-foreground">View and manage all incoming quotations.</p>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-xs">
                  {order.id.slice(-8)}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{order.user.name || "Unknown"}</div>
                  <div className="text-xs text-muted-foreground">{order.user.email}</div>
                </TableCell>
                <TableCell>
                  <ul className="text-sm space-y-1">
                    {order.items.map(item => (
                      <li key={item.id}>
                        <span className="font-medium">{item.product.name}</span> - {item.orderedQuantity.toString()} {item.orderedUnit} 
                        <span className="text-muted-foreground text-xs ml-1">(Base: {item.baseQuantity.toString()} {item.product.baseUnit})</span>
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="font-medium">
                  ₹{order.totalAmount.toString()}
                </TableCell>
                <TableCell>
                  <Badge variant={order.status === "PENDING" ? "secondary" : "default"}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
