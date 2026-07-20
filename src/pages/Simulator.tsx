import { useState, useMemo } from 'react'
import useAppStore from '@/stores/use-app-store'
import { calculatePrices } from '@/lib/calculations'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'

export default function Simulator() {
  const { properties, currentPropertyId, fixedCosts, variableCosts } = useAppStore()

  const property = properties.find((p) => p.id === currentPropertyId)
  const propFixed = fixedCosts.filter((c) => c.propertyId === currentPropertyId)
  const propVar = variableCosts.filter((c) => c.propertyId === currentPropertyId)

  const [occupancyRate, setOccupancyRate] = useState(50)
  const [adr, setAdr] = useState(300)

  const prices = useMemo(() => {
    if (!property) return null
    return calculatePrices(property, propFixed, propVar)
  }, [property, propFixed, propVar])

  if (!property || !prices) return null

  const totalAvailableRooms = property.rooms * 30
  const simulatedRoomsSold = totalAvailableRooms * (occupancyRate / 100)
  const simulatedRevenue = simulatedRoomsSold * adr
  const simulatedVariableCosts = simulatedRoomsSold * prices.variablePerRoom
  const simulatedTaxes = simulatedRevenue * (property.taxRegime / 100)

  const simulatedProfit =
    simulatedRevenue - prices.totalFixed - simulatedVariableCosts - simulatedTaxes
  const simulatedMargin = simulatedRevenue > 0 ? (simulatedProfit / simulatedRevenue) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Simulador de Cenários</h1>
        <p className="text-muted-foreground">Brinque com os números para prever a lucratividade.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Ajuste as Variáveis</CardTitle>
            <CardDescription>Mova os controles para ver o impacto em tempo real.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-base">Taxa de Ocupação Estimada</Label>
                <span className="font-bold text-primary">{occupancyRate}%</span>
              </div>
              <Slider
                value={[occupancyRate]}
                onValueChange={(v) => setOccupancyRate(v[0])}
                max={100}
                step={1}
              />
              <p className="text-xs text-muted-foreground text-right">
                {Math.round(simulatedRoomsSold)} diárias / mês
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label className="text-base">Diária Média Praticada (ADR)</Label>
                <span className="font-bold text-primary">{formatCurrency(adr)}</span>
              </div>
              <Slider
                value={[adr]}
                onValueChange={(v) => setAdr(v[0])}
                min={50}
                max={1500}
                step={10}
              />
              <p className="text-xs text-muted-foreground text-right">
                Preço Ideal Recomendado: {formatCurrency(prices.idealPrice)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-slate-50 dark:bg-card dark:text-card-foreground">
          <CardHeader>
            <CardTitle>Resultado Projetado</CardTitle>
            <CardDescription className="text-slate-400 dark:text-muted-foreground">
              Projeção mensal baseada nos valores ao lado.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-end border-b border-slate-800 dark:border-border pb-4">
              <span className="text-slate-300">Receita Bruta</span>
              <span className="text-2xl font-bold">{formatCurrency(simulatedRevenue)}</span>
            </div>

            <div className="space-y-2 text-sm text-slate-400 dark:text-muted-foreground">
              <div className="flex justify-between">
                <span>(-) Custos Fixos Totais</span>
                <span>{formatCurrency(prices.totalFixed)}</span>
              </div>
              <div className="flex justify-between">
                <span>(-) Custos Variáveis Projetados</span>
                <span>{formatCurrency(simulatedVariableCosts)}</span>
              </div>
              <div className="flex justify-between">
                <span>(-) Impostos Projetados</span>
                <span>{formatCurrency(simulatedTaxes)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 dark:border-border mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-medium">Lucro Líquido Projetado</span>
                <span
                  className={`text-3xl font-bold ${simulatedProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}
                >
                  {formatCurrency(simulatedProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Margem Real</span>
                <span
                  className={`font-bold ${simulatedMargin >= property.desiredMargin ? 'text-emerald-400' : 'text-amber-400'}`}
                >
                  {formatPercent(simulatedMargin)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
