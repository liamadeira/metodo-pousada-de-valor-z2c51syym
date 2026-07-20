import { useMemo } from 'react'
import useAppStore from '@/stores/use-app-store'
import { calculatePrices } from '@/lib/calculations'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Info, CheckCircle2, AlertTriangle, XOctagon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function Commercial() {
  const { properties, currentPropertyId, fixedCosts, variableCosts, channels } = useAppStore()

  const property = properties.find((p) => p.id === currentPropertyId)
  const propFixed = fixedCosts.filter((c) => c.propertyId === currentPropertyId)
  const propVar = variableCosts.filter((c) => c.propertyId === currentPropertyId)
  const propChannels = channels.filter((c) => c.propertyId === currentPropertyId)

  const prices = useMemo(() => {
    if (!property) return null
    return calculatePrices(property, propFixed, propVar)
  }, [property, propFixed, propVar])

  if (!property || !prices) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comercial & Formação de Preços</h1>
        <p className="text-muted-foreground">
          Canais de venda e calculadora inteligente do Método Pousada de Valor.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg text-rose-700 dark:text-rose-400">
                Preço de Emergência
              </CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Cobre apenas os custos variáveis e impostos da diária. Gera prejuízo fixo.
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-700 dark:text-rose-400">
              {formatCurrency(prices.emergencyPrice)}
            </div>
            <p className="text-xs text-rose-600/80 mt-2 flex items-center gap-1">
              <XOctagon className="w-3 h-3" /> Nunca venda abaixo disso
            </p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg text-amber-700 dark:text-amber-400">
                Preço Sustentável
              </CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Cobre custos variáveis, impostos e o rateio de custos fixos. Lucro zero.
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">
              {formatCurrency(prices.sustainablePrice)}
            </div>
            <p className="text-xs text-amber-600/80 mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Ponto de equilíbrio exato
            </p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">
                Preço Ideal
              </CardTitle>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  Cobre todos os custos e atinge a margem de lucro desejada (
                  {property.desiredMargin}%).
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatCurrency(prices.idealPrice)}
            </div>
            <p className="text-xs text-emerald-600/80 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Foco de vendas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Canais de Venda e Comissões</CardTitle>
          <CardDescription>Veja o impacto das comissões no seu preço ideal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead className="text-right">Comissão</TableHead>
                <TableHead className="text-right">Preço Sugerido (+ Comissão)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propChannels.map((channel) => {
                // To maintain the ideal price net, we gross up the price: Ideal / (1 - Commission)
                const priceWithCommission =
                  prices.idealPrice / Math.max(0.01, 1 - channel.commissionPercent / 100)

                return (
                  <TableRow key={channel.id}>
                    <TableCell className="font-medium">{channel.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={channel.commissionPercent > 0 ? 'secondary' : 'default'}>
                        {formatPercent(channel.commissionPercent)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {formatCurrency(priceWithCommission)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
