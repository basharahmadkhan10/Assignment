import { getUsers, toggleUserStatus } from "@/actions/users"
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

export default async function UsersPage() {
  const users = await getUsers()

  async function handleToggle(userId: string, currentStatus: boolean) {
    "use server"
    await toggleUserStatus(userId, currentStatus)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">Manage system access for buyers and sellers.</p>
      </div>

      <div className="rounded-xl border-4 border-foreground bg-card shadow-[4px_4px_0px_0px_var(--color-foreground)] overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b-4 border-foreground">
              <TableHead className="font-bold">Name</TableHead>
              <TableHead className="font-bold">Email</TableHead>
              <TableHead className="font-bold">Role</TableHead>
              <TableHead className="font-bold">Status</TableHead>
              <TableHead className="font-bold">Joined</TableHead>
              <TableHead className="text-right font-bold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-b-2 border-foreground/50">
                <TableCell className="font-bold">
                  {user.name || "Unknown"}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"} className="border-2 border-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? "default" : "destructive"} className="border-2 border-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)]">
                    {user.isActive ? "ACTIVE" : "INACTIVE"}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {user.role !== "ADMIN" && (
                    <form action={handleToggle.bind(null, user.id, user.isActive)}>
                      <Button 
                        type="submit" 
                        variant={user.isActive ? "destructive" : "default"} 
                        size="sm"
                        className="border-2 border-foreground shadow-[2px_2px_0px_0px_var(--color-foreground)] hover:translate-y-[1px] hover:translate-x-[1px] hover:shadow-[1px_1px_0px_0px_var(--color-foreground)] transition-all"
                      >
                        {user.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </form>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center font-bold">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
