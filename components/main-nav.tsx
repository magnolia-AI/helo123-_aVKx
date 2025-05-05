'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, Bell, Search } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link 
        href="/"
        className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${isActive('/') ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <Home className="h-4 w-4 mr-2" />
        <span className="hidden md:inline">Home</span>
      </Link>
      <Link 
        href="/explore"
        className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${isActive('/explore') ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <Search className="h-4 w-4 mr-2" />
        <span className="hidden md:inline">Explore</span>
      </Link>
      <Link 
        href="/notifications"
        className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${isActive('/notifications') ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <Bell className="h-4 w-4 mr-2" />
        <span className="hidden md:inline">Notifications</span>
      </Link>
      <Link 
        href="/profile/user1"
        className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${isActive('/profile') ? 'text-foreground' : 'text-muted-foreground'}`}
      >
        <User className="h-4 w-4 mr-2" />
        <span className="hidden md:inline">Profile</span>
      </Link>
    </nav>
  );
}
