import { redirect } from "next/navigation";

export default function AdminCatalogRedirectPage() {
  redirect("/dashboard/admin/products");
}
