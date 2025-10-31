"use client"

import { useSidebar } from './sidebar-context';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        'flex flex-col flex-1 transition-all duration-300 ease-in-out',
        isOpen ? 'ml-[15rem]' : 'ml-[3.5rem]'
      )}
    >
      {children}
    </div>
  );
}

