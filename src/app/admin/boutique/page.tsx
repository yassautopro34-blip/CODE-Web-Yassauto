import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import BoutiqueAdmin from "./boutique-admin";

export default async function AdminBoutiquePage() {
  if (!(await getAdminSession())) redirect("/admin/login");
  return <BoutiqueAdmin />;
}
