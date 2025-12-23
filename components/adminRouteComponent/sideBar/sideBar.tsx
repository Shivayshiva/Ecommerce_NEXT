"use client";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Store,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      href: "/products",
      icon: Package,
    },
    {
      label: "Flash Deals",
      href: "/flashDeals",
      icon: Zap,
    },
    {
      label: "Orders",
      href: "/orders",
      icon: ShoppingCart,
    },
    {
      label: "Users",
      href: "/users",
      icon: Users,
    },
  ];

  return (
    <Sidebar
      collapsible="none"
      className="border-r border-border bg-linear-to-b from-card/80 via-background to-card/60 pr-5"
    >
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Store className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Admin Panel
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Manage your store
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname?.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        "justify-start gap-2",
                        "data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
                      )}
                    >
                      <Link href={item.href}>
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary/80 px-4 py-2 text-xs font-medium text-secondary-foreground transition hover:bg-secondary"
        >
          Back to store
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}