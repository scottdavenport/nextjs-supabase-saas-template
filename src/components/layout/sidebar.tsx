"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSidebar } from './sidebar-context';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out',
        isOpen ? 'w-sidebar-expanded' : 'w-sidebar-collapsed'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <div className={cn('flex items-center gap-2', !isOpen && 'justify-center')}>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggle}
              className="h-8 w-8"
              aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {isOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
            {isOpen && (
              <h2 className="text-lg font-semibold text-sidebar-foreground">Menu</h2>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'sidebar-nav-item',
                  isActive && 'sidebar-nav-item-active',
                  !isOpen && 'justify-center'
                )}
                title={!isOpen ? item.name : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

