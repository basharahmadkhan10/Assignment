import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  // Redirect to role-specific default page
  if (session.user.role === "ADMIN") {
    redirect("/dashboard/overview")
  } else {
    redirect("/dashboard/quotation")
  }

  return null
}
