import { useState } from 'react'
import useAppStore from '@/stores/use-app-store'
import { formatCurrency } from '@/lib/formatters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function Operations() {
  const [isDetailed, setIsDetailed] = useState(true)
  const { currentPropertyId, reservations, channels } = useAppStore()

  const propReservations = reservations.filter((r) => r.propertyId === currentPropertyId)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operações & Lançamentos</h1>
          <p className="text-muted-foreground">
            Registre receitas de forma consolidada ou por reserva.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-muted p-2 rounded-lg">
          <Label
            htmlFor="mode-toggle"
            className={!isDetailed ? 'font-bold' : 'text-muted-foreground'}
          >
            Simplificado
          </Label>
          <Switch id="mode-toggle" checked={isDetailed} onCheckedChange={setIsDetailed} />
          <Label
            htmlFor="mode-toggle"
            className={isDetailed ? 'font-bold' : 'text-muted-foreground'}
          >
            Detalhado
          </Label>
        </div>
      </div>

      {!isDetailed ? (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Lançamento Simplificado Mensal</CardTitle>
            <CardDescription>Informe apenas o total faturado por canal no mês.</CardDescription>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg mx-6 mb-6">
            Modo simplificado focado em fechamento mensal (Em breve).
          </CardContent>
        </Card>
      ) : (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Lista de Reservas do Mês</CardTitle>
            <CardDescription>Detalhes diários de check-in e check-out.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead className="text-center">Quartos</TableHead>
                  <TableHead className="text-right">Receita Bruta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {propReservations.map((res) => {
                  const channel = channels.find((c) => c.id === res.channelId)
                  return (
                    <TableRow key={res.id}>
                      <TableCell>{res.checkIn}</TableCell>
                      <TableCell>{res.checkOut}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{channel?.name || 'Desconhecido'}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{res.rooms}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(res.revenue)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
