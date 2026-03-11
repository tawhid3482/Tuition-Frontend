import { redirect } from "next/navigation";

export default function SuperAdminCatalogRedirectPage() {
  redirect("/dashboard/super-admin/products");
}
