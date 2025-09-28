"use client";

import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Image, Map, MessageSquare, Route, Sparkles, Ticket } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", icon: MessageSquare, label: "Chat" },
  { href: "/dashboard/tour", icon: Route, label: "Personalized Tour" },
  { href: "/dashboard/tickets", icon: Ticket, label: "Tickets" },
  { href: "/dashboard/map", icon: Map, label: "Museum Map" },
];

export function Nav() {
  const pathname = usePathname();

  // Hide tour link since it's in the chat
  const filteredNavItems = navItems.filter(item => item.href !== '/dashboard/tour');

  return (
    <SidebarMenu>
      {filteredNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
              className="group-data-[collapsible=icon]:justify-center"
            >
              <item.icon
                className="text-sidebar-primary"
                aria-hidden="true"
              />
              <span className="group-data-[collapsible=icon]:hidden">
                {item.label}
              </span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
