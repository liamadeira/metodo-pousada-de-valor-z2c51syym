import { useMemo, useState } from 'react'
import useAppStore from '@/stores/use-app-store'
import { calculateScenarioPrices } from '@/lib/calculations'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

export default function Commercial() {
  const { properties, currentPropertyId, fixedCosts, variableCosts, channels, paymentMethods } =
    useAppStore()
  const property = properties.find((p) => p.id === currentPropertyId)
  const propFixed = fixedCosts.filter((c) => c.propertyId === currentPropertyId)
  const propVar = variableCosts.filter((c) => c.propertyId === currentPropertyId)
  const propChannels = channels.filter((c) => c.propertyId === currentPropertyId)
  const propPayments = paymentMethods.filter((pm) => pm.propertyId === currentPropertyId)
  const [selectedPaymentId, setSelectedPaymentId] = useState(propPayments[0]?.id ?? '')

  const selectedPayment = propPayments.find((pm) => pm.id === selectedPaymentId)
  const directChannel = propChannels.find((c) => c.name === 'Venda Direta')

  const basePrices = useMemo(() => {
    if (!property) return null
    return calculateScenarioPrices(property, propFixed, propVar, 50, directChannel, selectedPayment)
  }, [property, propFixed, propVar, directChannel, selectedPayment])

  if (!property || !basePrices) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comercial & Formação de Preços</h1>
        <p className="text-muted-foreground">Canais, pagamentos e preços de referência.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            label: 'Preço de Emergência',
            price: basePrices.emergencyPrice,
            color: 'rose',
            icon: XOctagon,
            desc: 'Nunca venda abaixo disso',
          },
          {
            label: 'Preço Sustentável',
            price: basePrices.sustainablePrice,
            color: 'amber',
            icon: AlertTriangle,
            desc: 'Ponto de equilíbrio exato',
          },
          {
            label: 'Preço Ideal',
            price: basePrices.idealPrice,
            color: 'emerald',
            icon: CheckCircle2,
            desc: `Foco de vendas (${property.desiredMargin}%)`,
          },
        ].map((card) => (
          <Card
            key={card.label}
            className={`border-${card.color}-200 dark:border-${card.color}-900 bg-${card.color}-50/50 dark:bg-${card.color}-950/20`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className={`text-lg text-${card.color}-700 dark:text-${card.color}-400`}>
                  {card.label}
                </CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>{card.desc}</TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className={`text-3xl font-bold text-${card.color}-700 dark:text-${card.color}-400`}
              >
                {formatCurrency(card.price)}
              </div>
              <p className={`text-xs text-${card.color}-600/80 mt-2 flex items-center gap-1`}>
                <card.icon className="w-3 h-3" /> {card.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Comparação de Canais e Formas de Pagamento</CardTitle>
          <CardDescription>Veja o impacto de comissões e taxas no preço ideal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="space-y-2 w-64">
              <Label>Forma de Pagamento</Label>
              <Select value={selectedPaymentId} onValueChange={setSelectedPaymentId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {propPayments.map((pm) => (
                    <SelectItem key={pm.id} value={pm.id}>
                      {pm.name} ({pm.feePercent}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead className="text-right">Comissão</TableHead>
                <TableHead className="text-right">Taxa Pagamento</TableHead>
                <TableHead className="text-right">Preço Sugerido</TableHead>
                <TableHead className="text-right">Receita Líquida</TableHead>
                <TableHead className="text-right">Consumo da Margem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propChannels.map((channel) => {
                const result = calculateScenarioPrices(
                  property,
                  propFixed,
                  propVar,
                  50,
                  channel,
                  selectedPayment,
                )
                const suggestedPrice = result.idealPrice
                const netRevenue =
                  suggestedPrice *
                  (1 -
                    channel.commissionPercent / 100 -
                    (selectedPayment?.feePercent ?? 0) / 100 -
                    property.taxRegime / 100)
                const marginConsumed =
                  suggestedPrice > 0 ? (1 - netRevenue / suggestedPrice) * 100 : 0
                return (
                  <TableRow key={channel.id}>
                    <TableCell className="font-medium">{channel.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={channel.commissionPercent > 0 ? 'secondary' : 'default'}>
                        {formatPercent(channel.commissionPercent)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPercent(selectedPayment?.feePercent ?? 0)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {formatCurrency(suggestedPrice)}
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(netRevenue)}</TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          marginConsumed > 30
                            ? 'destructive'
                            : marginConsumed > 15
                              ? 'secondary'
                              : 'default'
                        }
                      >
                        {formatPercent(marginConsumed)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preço Equivalente entre Canais</CardTitle>
          <CardDescription>
            Quanto cobrar em cada canal para obter a mesma receita líquida da Venda Direta.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead className="text-right">Receita Alvo (Direta)</TableHead>
                <TableHead className="text-right">Preço Equivalente</TableHead>
                <TableHead className="text-right">Diferença</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                const directNet =
                  basePrices.idealPrice *
                  (1 - 0 - (selectedPayment?.feePercent ?? 0) / 100 - property.taxRegime / 100)
                return propChannels.map((channel) => {
                  const totalDeduction =
                    channel.commissionPercent / 100 +
                    (selectedPayment?.feePercent ?? 0) / 100 +
                    property.taxRegime / 100
                  const equivalentPrice = totalDeduction < 1 ? directNet / (1 - totalDeduction) : 0
                  const diff = equivalentPrice - basePrices.idealPrice
                  return (
                    <TableRow key={channel.id}>
                      <TableCell className="font-medium">{channel.name}</TableCell>
                      <TableCell className="text-right">{formatCurrency(directNet)}</TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(equivalentPrice)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={diff > 0 ? 'destructive' : 'default'}>
                          {diff > 0 ? '+' : ''}
                          {formatCurrency(diff)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  )
                })
              })()}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
