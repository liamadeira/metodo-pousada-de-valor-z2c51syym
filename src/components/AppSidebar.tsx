import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Receipt,
  TrendingUp,
  Calculator,
  Activity,
  Settings,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, url: '/' },
  { title: 'Propriedades', icon: Building2, url: '/properties' },
  { title: 'Custos & Equipe', icon: Receipt, url: '/costs' },
  { title: 'Comercial & Preços', icon: TrendingUp, url: '/commercial' },
  { title: 'Operações', icon: Calculator, url: '/operations' },
  { title: 'Simulador', icon: Activity, url: '/simulator' },
  { title: 'Configuração', icon: Settings, url: '/setup' },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex items-center justify-center border-b">
        <h2 className="font-bold text-primary text-xl tracking-tight">Pousada de Valor</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
