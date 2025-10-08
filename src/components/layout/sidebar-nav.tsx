'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ScanLine,
  UserPlus,
  ClipboardList,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { Icons } from '../icons';

const links = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/register-driver',
    label: 'Register Driver',
    icon: UserPlus,
  },
  {
    href: '/scan',
    label: 'Scan QR',
    icon: ScanLine,
  },
  {
    href: '/logs',
    label: 'Scan Logs',
    icon: ClipboardList,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {links.map((link) => (
        <SidebarMenuItem key={link.href}>
          <Link href={link.href}>
            <SidebarMenuButton
              isActive={pathname === link.href}
              tooltip={link.label}
            >
              <link.icon className="h-4 w-4" />
              <span>{link.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function SidebarHeaderContent() {
    return (
        <div className="flex items-center gap-2">
            <Icons.Logo className="h-8 w-8 flex-shrink-0" />
            <div className="flex flex-col">
                <h2 className="text-lg font-bold tracking-tighter text-sidebar-primary-foreground font-headline">VehiclePass</h2>
                <p className="text-xs text-sidebar-foreground/70">UniIlorin</p>
            </div>
        </div>
    )
}
