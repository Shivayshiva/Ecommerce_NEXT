"use client";
import type { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import AdminSidebar from "@/components/adminRouteComponent/sideBar/sideBar";
import AdminHeader from "@/components/adminRouteComponent/header/header";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="max-w-full">
    <SidebarProvider defaultOpen={true}>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader />
        {/* <main className="flex-1 px-6 py-6"> */}
          <main className="min-w-0 max-w-full overflow-x-hidden p-4">
          {children}
          </main>
      </SidebarInset>
    </SidebarProvider>
    </div>
  );
}
