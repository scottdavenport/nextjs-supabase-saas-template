import { requireAuth } from '@/lib/auth/session';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { SidebarProvider } from '@/components/layout/sidebar-context';
import { MainContent } from '@/components/layout/main-content';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will redirect to login if not authenticated
  const user = await requireAuth();

  return (
    <SidebarProvider>
      <div className="relative min-h-screen bg-background">
        <Sidebar />
        
        <MainContent>
          <Header user={user} />
          
          <main className="p-6 pb-20 md:pb-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </MainContent>
      </div>
    </SidebarProvider>
  );
}
