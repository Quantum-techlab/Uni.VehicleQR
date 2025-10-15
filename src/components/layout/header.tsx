'use client';

import { useAuth } from '@/lib/hooks/use-auth';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { usePathname, useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export function Header() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email[0].toUpperCase();
  };

  const segments = pathname
    ?.split('/')
    .filter(Boolean)
    .slice(1); // drop leading "(protected)" segment

  const breadcrumbBase = [
    { href: '/dashboard', label: 'Dashboard' },
  ];
  const dynamicCrumbs = (segments || []).map((seg, idx) => {
    const href = '/' + (segments || []).slice(0, idx + 1).join('/');
    const isId = seg.match(/^\[?.*\]?$/) || seg.length > 24; // crude id check
    return { href, label: isId ? 'Details' : seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) };
  });
  const crumbs = [...breadcrumbBase, ...dynamicCrumbs];

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden md:flex flex-col">
        <nav className="flex items-center text-sm text-muted-foreground">
          {crumbs.map((c, i) => (
            <div key={c.href} className="flex items-center">
              {i > 0 && <span className="mx-2">/</span>}
              <Link href={c.href} className={i === crumbs.length - 1 ? 'text-foreground font-semibold' : 'hover:text-foreground'}>
                {c.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className="text-xl font-headline font-semibold leading-tight">
          {crumbs[crumbs.length - 1]?.label || 'Dashboard'}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" alt="User avatar" />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user?.email)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Admin</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
