import { Bell, User, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SidebarTrigger } from '@/components/ui/sidebar'
import useAppStore from '@/stores/use-app-store'

export function Header() {
  const { properties, currentPropertyId, setCurrentPropertyId } = useAppStore()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4 md:px-6 z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <Select value={currentPropertyId} onValueChange={setCurrentPropertyId}>
          <SelectTrigger className="w-[200px] hidden sm:flex font-medium">
            <SelectValue placeholder="Selecione a propriedade" />
          </SelectTrigger>
          <SelectContent>
            {properties.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden sm:flex h-9 gap-2">
          <Plus className="w-4 h-4" />
          <span>Nova Receita</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-pulse-subtle"></span>
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-muted">
          <User className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
