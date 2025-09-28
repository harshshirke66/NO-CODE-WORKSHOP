"use client";

import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Image, Map, Route, Sparkles } from "lucide-react";
import Link from "next/link";

const navItems = [
  { href: "/dashboard", icon: Image, label: "Identify Artwork" },
  { href: "/dashboard/tour", icon: Route, label: "Personalized Tour" },
  { href: "/dashboard/map", icon: Map, label: "Museum Map" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href}>
            <SidebarMenuButton
              isActive={pathname === item.href}
              tooltip={item.label}
              className="group-data-[collapsible=icon]:justify-center"
            >
              <item.icon
                className="text-accent"
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
