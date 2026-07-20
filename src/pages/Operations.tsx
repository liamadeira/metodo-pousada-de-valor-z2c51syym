import { useState, useMemo } from 'react'
import useAppStore from '@/stores/use-app-store'
import { formatCurrency } from '@/lib/formatters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { BedDouble, Settings2, TrendingUp, Inbox } from 'lucide-react'

export default function Operations() {
  const [isDetailed, setIsDetailed] = useState(true)
  const { isLoading, currentPropertyId, properties, scenarios, variableCosts, channels } =
    useAppStore()

  const property = properties?.find((p) => p.id === currentPropertyId) ?? null
  const propScenarios = scenarios?.filter((s) => s.propertyId === currentPropertyId) ?? []
  const propVariableCosts = variableCosts?.filter((vc) => vc.propertyId === currentPropertyId) ?? []
  const propChannels = channels?.filter((c) => c.propertyId === currentPropertyId) ?? []

  const totalVariablePerStay = useMemo(
    () => propVariableCosts.reduce((sum, vc) => sum + (vc.amountPerStay || 0), 0),
    [propVariableCosts],
  )
  const totalVariablePerGuest = useMemo(
    () => propVariableCosts.reduce((sum, vc) => sum + (vc.amountPerGuest || 0), 0),
    [propVariableCosts],
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando dados operacionais...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
              <Inbox className="w-6 h-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">Nenhuma propriedade encontrada</h3>
              <p className="text-sm text-muted-foreground">
                Crie uma propriedade nas configurações para começar a gerenciar suas operações.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operações & Configurações</h1>
          <p className="text-muted-foreground">
            Configure quartos, categorias e custos variáveis para os cenários de precificação.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-muted p-2 rounded-lg">
          <Label
            htmlFor="mode-toggle"
            className={!isDetailed ? 'font-bold' : 'text-muted-foreground'}
          >
            Resumo
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BedDouble className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quartos Disponíveis</p>
                <p className="text-2xl font-bold">
                  {property.rooms - (property.blockedRooms || 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cenários Configurados</p>
                <p className="text-2xl font-bold">{propScenarios.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Custo Variável/Estadia</p>
                <p className="text-2xl font-bold">{formatCurrency(totalVariablePerStay)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isDetailed ? (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Resumo Operacional</CardTitle>
            <CardDescription>
              Visão consolidada dos custos e configurações da propriedade.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Total de Quartos</p>
                <p className="text-xl font-bold">{property.rooms}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Quartos Bloqueados</p>
                <p className="text-xl font-bold">{property.blockedRooms || 0}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Custo Variável/Hóspede</p>
                <p className="text-xl font-bold">{formatCurrency(totalVariablePerGuest)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">Margem Desejada</p>
                <p className="text-xl font-bold">{property.desiredMargin}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Cenários de Ocupação</CardTitle>
              <CardDescription>
                A precificação é baseada em cenários de planejamento, não em reservas em tempo real.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {propScenarios.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  Nenhum cenário configurado. Crie cenários na página de Custos.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cenário</TableHead>
                      <TableHead className="text-center">Ocupação</TableHead>
                      <TableHead className="text-center">Quartos Vendidos</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {propScenarios.map((sc) => (
                      <TableRow key={sc.id}>
                        <TableCell className="font-medium">{sc.name}</TableCell>
                        <TableCell className="text-center">{sc.occupancyRate}%</TableCell>
                        <TableCell className="text-center">
                          {Math.round(
                            ((property.rooms - (property.blockedRooms || 0)) * sc.occupancyRate) /
                              100,
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {sc.isDefault ? (
                            <Badge variant="secondary">Padrão</Badge>
                          ) : (
                            <Badge variant="outline">Personalizado</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custos Variáveis por Estadia</CardTitle>
              <CardDescription>
                Custos que incidem por hóspede ou por estadia para cálculo de precificação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {propVariableCosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  Nenhum custo variável cadastrado. Configure os custos na página de Custos.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Custo</TableHead>
                      <TableHead className="text-right">Por Hóspede</TableHead>
                      <TableHead className="text-right">Por Estadia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {propVariableCosts.map((vc) => (
                      <TableRow key={vc.id}>
                        <TableCell className="font-medium">{vc.name}</TableCell>
                        <TableCell className="text-right">
                          {vc.amountPerGuest > 0 ? formatCurrency(vc.amountPerGuest) : '—'}
                        </TableCell>
                        <TableCell className="text-right">
                          {vc.amountPerStay > 0 ? formatCurrency(vc.amountPerStay) : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-bold bg-muted/50">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalVariablePerGuest)}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(totalVariablePerStay)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Canais de Venda</CardTitle>
              <CardDescription>
                Comissões e taxas por canal, usadas no cálculo de precificação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {propChannels.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  Nenhum canal configurado. Defina canais na página Comercial.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Canal</TableHead>
                      <TableHead className="text-right">Comissão (%)</TableHead>
                      <TableHead className="text-right">Taxa Fixa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {propChannels.map((ch) => (
                      <TableRow key={ch.id}>
                        <TableCell className="font-medium">
                          <Badge variant="outline">{ch.name}</Badge>
                        </TableCell>
                        <TableCell className="text-right">{ch.commissionPercent}%</TableCell>
                        <TableCell className="text-right">
                          {ch.fixedFee > 0 ? formatCurrency(ch.fixedFee) : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuração de Quartos</CardTitle>
              <CardDescription>
                Defina a capacidade e quartos bloqueados para cálculos de rateio.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Total de Quartos</Label>
                  <Input
                    type="number"
                    defaultValue={property.rooms}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quartos Bloqueados</Label>
                  <Input
                    type="number"
                    defaultValue={property.blockedRooms || 0}
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Regime Tributário (%)</Label>
                  <Input
                    type="number"
                    defaultValue={property.taxRegime}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <Button variant="outline" className="gap-2">
                  <Settings2 className="w-4 h-4" />
                  Editar nas Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
