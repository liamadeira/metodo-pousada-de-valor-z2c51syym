import useAppStore from '@/stores/use-app-store'
import { calculateBreakfastCostPerDay } from '@/lib/laundry-calculations'
import { formatCurrency } from '@/lib/formatters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Coffee } from 'lucide-react'

export function BreakfastManager() {
  const { currentPropertyId, breakfastSettings } = useAppStore()
  const settings = breakfastSettings.filter((s) => s.propertyId === currentPropertyId)

  return (
    <div className="space-y-6">
      {settings.map((setting) => {
        const costPerDay = calculateBreakfastCostPerDay(setting, 2)
        return (
          <Card key={setting.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="w-5 h-5" /> Café da Manhã
              </CardTitle>
              <CardDescription>
                Método: <Badge variant="secondary">{setting.costingMethod.replace('_', ' ')}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Custo por Pessoa</p>
                  <p className="text-2xl font-bold">{formatCurrency(setting.costPerPerson)}</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground">Custo/Diária (2 hóspedes)</p>
                  <p className="text-2xl font-bold text-primary">{formatCurrency(costPerDay)}</p>
                </div>
              </div>

              {setting.costingMethod === 'component' && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Componente</TableHead>
                      <TableHead className="text-right">Custo Unit.</TableHead>
                      <TableHead className="text-center">Qtd/Pessoa</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {setting.components.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(c.cost)}</TableCell>
                        <TableCell className="text-center">{c.quantityPerPerson}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(c.cost * c.quantityPerPerson)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell colSpan={3}>Total por Pessoa</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(
                          setting.components.reduce((s, c) => s + c.cost * c.quantityPerPerson, 0),
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
