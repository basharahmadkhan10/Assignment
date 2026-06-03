import { getOrders, updateOrderStatus } from "@/actions/orders"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === "ADMIN"
  const orders = await getOrders()

  async function handleStatus(orderId: string, status: "CONFIRMED" | "CANCELLED", userId: string) {
    "use server"
    await updateOrderStatus(orderId, status, userId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Quotations & Orders</h1>
        <p className="text-muted-foreground">View and manage all incoming quotations.</p>
      </div>

      <div className="rounded-md border bg-card overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
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
                <TableCell className="font-medium text-primary">
                  ₹{order.totalAmount.toString()}
                </TableCell>
                <TableCell>
                  <Badge variant={order.status === "PENDING" ? "secondary" : order.status === "CONFIRMED" ? "default" : "destructive"}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right space-x-2">
                    {order.status === "PENDING" && (
                      <form action={handleStatus.bind(null, order.id, "CONFIRMED", order.userId)} className="inline">
                        <Button type="submit" size="sm" variant="default" className="text-xs h-7">Approve</Button>
                      </form>
                    )}
                    {order.status === "PENDING" && (
                      <form action={handleStatus.bind(null, order.id, "CANCELLED", order.userId)} className="inline">
                        <Button type="submit" size="sm" variant="destructive" className="text-xs h-7">Reject</Button>
                      </form>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={isAdmin ? 7 : 6} className="h-24 text-center text-muted-foreground">
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
