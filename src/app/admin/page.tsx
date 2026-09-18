import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import AdminDashboard from "./admin-dashboard";

export default async function AdminPage() {
  if (!(await getAdminSession())) {
    redirect("/admin/login");
  }

  return <AdminDashboard />;
}