import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

type UserLayoutProps = {
  children: ReactNode;
};

export default async function UserLayout({ children }: UserLayoutProps) {
  const session = await getServerSession(authOptions);

  // If user is already logged in, send them back to the main page (`/` → `(public)/page.tsx`)
  if (session) {
    redirect("/");
  }

  // Not logged in → render auth pages (signin/signup, etc.)
  return <>{children}</>;
}