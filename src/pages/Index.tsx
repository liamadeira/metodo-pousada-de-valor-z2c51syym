import { useMemo, useState } from 'react'
import useAppStore from '@/stores/use-app-store'
import {
  calculateAvailableDays,
  calculateScenarioPrices,
  calculateEmptyRoomCost,
  calculateVariableCostPerDay,
  calculateEquilibriumOccupancy,
} from '@/lib/calculations'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, Plus, Settings2 } from 'lucide-react'
import { ScenarioTable } from '@/components/ScenarioTable'
import { SmartAlert } from '@/components/SmartAlert'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Index() {
  const {
    isLoading,
    properties,
    currentPropertyId,
    fixedCosts,
    variableCosts,
    channels,
    paymentMethods,
  } = useAppStore()
  const [taxOverride, setTaxOverride] = useState<number | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const property = properties.find((p) => p.id === currentPropertyId)
  const propFixed = fixedCosts.filter((c) => c.propertyId === currentPropertyId)
  const propVar = variableCosts.filter((c) => c.propertyId === currentPropertyId)
  const directChannel = channels.find(
    (c) => c.propertyId === currentPropertyId && c.name === 'Venda Direta',
  )
  const pixMethod = paymentMethods.find(
    (pm) => pm.propertyId === currentPropertyId && pm.name === 'Pix',
  )

  const adjustedProp = useMemo(
    () => (taxOverride !== null && property ? { ...property, taxRegime: taxOverride } : property),
    [property, taxOverride],
  )

  const baseResult = useMemo(() => {
    if (!adjustedProp) return null
    return calculateScenarioPrices(adjustedProp, propFixed, propVar, 50, directChannel, pixMethod)
  }, [adjustedProp, propFixed, propVar, directChannel, pixMethod])

  const emptyRoomCost = useMemo(
    () => (adjustedProp ? calculateEmptyRoomCost(adjustedProp, propFixed) : 0),
    [adjustedProp, propFixed],
  )
  const incrementalCost = useMemo(() => calculateVariableCostPerDay(propVar), [propVar])
  const equilibrium = useMemo(() => {
    if (!adjustedProp || !baseResult) return 0
    return calculateEquilibriumOccupancy(
      adjustedProp,
      propFixed,
      propVar,
      baseResult.idealPrice,
      directChannel,
      pixMethod,
    )
  }, [adjustedProp, propFixed, propVar, baseResult, directChannel, pixMethod])

  const defaultScenarios = [
    { name: 'Baixa (30%)', occupancyRate: 30 },
    { name: 'Média (50%)', occupancyRate: 50 },
    { name: 'Alta (70%)', occupancyRate: 70 },
    { name: 'Lotado (90%)', occupancyRate: 90 },
  ]

  if (isLoading || !property || !baseResult || !adjustedProp) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Estratégico</h1>
        <p className="text-muted-foreground">Análise financeira baseada em cenários de ocupação.</p>
      </div>

      <SmartAlert
        status={equilibrium > 70 ? 'red' : equilibrium > 50 ? 'yellow' : 'green'}
        title={`Ponto de Equilíbrio: ${formatPercent(equilibrium)}`}
        description={
          equilibrium > 70
            ? 'Sua pousada precisa de mais de 70% de ocupação para cobrir custos. Considere reduzir custos fixos ou aumentar preços.'
            : equilibrium > 50
              ? 'Ocupação de equilíbrio em nível moderado. Monitore os custos de perto.'
              : 'Estrutura saudável. Ponto de equilíbrio abaixo de 50% de ocupação.'
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo de Estrutura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(baseResult.totalFixed)}</div>
            <p className="text-xs text-muted-foreground mt-1">Custos fixos mensais</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Quarto Vazio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">{formatCurrency(emptyRoomCost)}</div>
            <p className="text-xs text-muted-foreground mt-1">Custo fixo por diária disponível</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Custo Incremental</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {formatCurrency(incrementalCost)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Custo variável por diária</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ponto de Equilíbrio</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(equilibrium)}</div>
            <p className="text-xs text-muted-foreground mt-1">Ocupação mínima p/ break-even</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            label: 'Preço de Emergência',
            price: baseResult.emergencyPrice,
            color: 'rose',
            desc: 'Cobre apenas variáveis',
          },
          {
            label: 'Preço Sustentável',
            price: baseResult.sustainablePrice,
            color: 'amber',
            desc: 'Cobre todos os custos',
          },
          {
            label: 'Preço Ideal',
            price: baseResult.idealPrice,
            color: 'emerald',
            desc: `Margem de ${property.desiredMargin}%`,
          },
        ].map((card) => (
          <Card
            key={card.label}
            className={`border-${card.color}-200 dark:border-${card.color}-900 bg-${card.color}-50/50 dark:bg-${card.color}-950/20`}
          >
            <CardHeader className="pb-2">
              <CardTitle className={`text-lg text-${card.color}-700 dark:text-${card.color}-400`}>
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold text-${card.color}-700 dark:text-${card.color}-400`}
              >
                {formatCurrency(card.price)}
              </div>
              <p className={`text-xs text-${card.color}-600/80 mt-2`}>{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparação de Cenários</CardTitle>
          <CardDescription>
            Preços recomendados por nível de ocupação (Venda Direta / Pix)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScenarioTable
            property={adjustedProp}
            fixedCosts={propFixed}
            variableCosts={propVar}
            scenarios={defaultScenarios}
            channel={directChannel}
            paymentMethod={pixMethod}
          />
        </CardContent>
      </Card>

      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Settings2 className="w-4 h-4" /> Opções Avançadas
                </CardTitle>
                <Button variant="ghost" size="sm">
                  {showAdvanced ? 'Recolher' : 'Expandir'}
                </Button>
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Substituir Impostos (%) — Padrão: {property.taxRegime}%</Label>
                  <Input
                    type="number"
                    placeholder={String(property.taxRegime)}
                    value={taxOverride ?? ''}
                    onChange={(e) => setTaxOverride(e.target.value ? Number(e.target.value) : null)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Diárias Disponíveis no Período</Label>
                  <Input
                    readOnly
                    value={Math.round(calculateAvailableDays(adjustedProp))}
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>
  )
}
