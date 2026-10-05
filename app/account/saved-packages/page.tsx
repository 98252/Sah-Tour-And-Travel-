import { redirect } from "next/navigation";

export default function SavedPackagesRedirect() {
  redirect("/account?tab=wishlist");
}
