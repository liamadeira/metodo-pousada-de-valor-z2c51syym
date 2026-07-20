import { useMemo } from 'react'
import useAppStore from '@/stores/use-app-store'
import { calculateMetrics, calculatePrices } from '@/lib/calculations'
import { formatCurrency, formatPercent, formatNumber } from '@/lib/formatters'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Activity, TrendingUp, AlertCircle, Building2, BedDouble } from 'lucide-react'
import { RevenueChart } from '@/components/charts/RevenueChart'

export default function Index() {
  const {
    isLoading,
    properties,
    currentPropertyId,
    reservations,
    fixedCosts,
    variableCosts,
    channels,
  } = useAppStore()

  const property = properties.find((p) => p.id === currentPropertyId)
  const propReservations = reservations.filter((r) => r.propertyId === currentPropertyId)
  const propFixedCosts = fixedCosts.filter((c) => c.propertyId === currentPropertyId)
  const propVariableCosts = variableCosts.filter((c) => c.propertyId === currentPropertyId)

  const metrics = useMemo(() => {
    if (!property) return null
    return calculateMetrics(property, propReservations, propFixedCosts, propVariableCosts)
  }, [property, propReservations, propFixedCosts, propVariableCosts])

  const prices = useMemo(() => {
    if (!property) return null
    return calculatePrices(property, propFixedCosts, propVariableCosts)
  }, [property, propFixedCosts, propVariableCosts])

  const chartData = useMemo(() => {
    return channels.map((c) => {
      const rev = propReservations
        .filter((r) => r.channelId === c.id)
        .reduce((sum, r) => sum + r.revenue, 0)
      return { name: c.name, revenue: rev }
    })
  }, [channels, propReservations])

  if (isLoading || !metrics || !prices || !property) {
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

  const isBelowSustainable = metrics.adr > 0 && metrics.adr < prices.sustainablePrice

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral financeira do mês atual.</p>
        </div>
      </div>

      {isBelowSustainable && (
        <Alert
          variant="destructive"
          className="animate-pulse-subtle border-l-4 border-l-destructive"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenção: Diária Média (ADR) muito baixa!</AlertTitle>
          <AlertDescription>
            Sua diária média atual ({formatCurrency(metrics.adr)}) está abaixo do Preço Sustentável
            ({formatCurrency(prices.sustainablePrice)}). Você está operando com prejuízo e não
            cobrindo os custos fixos.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <BedDouble className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercent(metrics.occupancyRate)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.occupiedRoomNights} de {metrics.availableRoomNights} diárias vendidas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diária Média (ADR)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(metrics.adr)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Preço Ideal: {formatCurrency(prices.idealPrice)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">RevPAR</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.revPar)}</div>
            <p className="text-xs text-muted-foreground mt-1">Receita por quarto disponível</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${metrics.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {formatCurrency(metrics.netProfit)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Após dedução de custos e impostos</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-4">
          <CardHeader>
            <CardTitle>Receita por Canal</CardTitle>
            <CardDescription>Distribuição de vendas no mês atual</CardDescription>
          </CardHeader>
          <CardContent>
            <RevenueChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Ponto de Equilíbrio</CardTitle>
            <CardDescription>Progresso para cobrir custos fixos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-muted-foreground">Diárias Necessárias</span>
                <span className="font-bold">{formatNumber(prices.breakEvenRooms)}</span>
              </div>
              <div className="w-full bg-secondary/20 h-4 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all"
                  style={{
                    width: `${Math.min(100, (metrics.occupiedRoomNights / (prices.breakEvenRooms || 1)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Você vendeu {metrics.occupiedRoomNights} diárias até o momento.
              </p>
            </div>

            <div className="pt-4 border-t space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Custos Fixos Totais</span>
                <span className="font-medium">{formatCurrency(metrics.totalFixedCosts)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Custos Variáveis Totais</span>
                <span className="font-medium">{formatCurrency(metrics.totalVariableCosts)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Impostos Estimados</span>
                <span className="font-medium">{formatCurrency(metrics.taxes)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
