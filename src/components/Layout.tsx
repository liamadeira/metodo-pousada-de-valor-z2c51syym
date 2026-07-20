import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Header } from './Header'

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen bg-slate-50/50 dark:bg-background">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 w-full max-w-7xl mx-auto animate-fade-in">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
