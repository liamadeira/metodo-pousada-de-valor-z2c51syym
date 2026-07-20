import { useMemo, useState } from 'react'
import useAppStore from '@/stores/use-app-store'
import { calculateCategoryScenarioPrices, allocateFixedCosts } from '@/lib/calculations'
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
import { CategoryPriceTable } from '@/components/CategoryPriceTable'

export default function Commercial() {
  const { properties, currentPropertyId, fixedCosts, channels, paymentMethods, roomCategories } =
    useAppStore()
  const property = properties.find((p) => p.id === currentPropertyId)
  const propFixed = fixedCosts.filter((c) => c.propertyId === currentPropertyId)
  const propCategories = roomCategories.filter((c) => c.propertyId === currentPropertyId)
  const propChannels = channels.filter((c) => c.propertyId === currentPropertyId)
  const propPayments = paymentMethods.filter((pm) => pm.propertyId === currentPropertyId)
  const [selectedCategoryId, setSelectedCategoryId] = useState(propCategories[0]?.id ?? '')
  const [selectedPaymentId, setSelectedPaymentId] = useState(propPayments[0]?.id ?? '')

  const selectedCategory = propCategories.find((c) => c.id === selectedCategoryId)
  const selectedPayment = propPayments.find((pm) => pm.id === selectedPaymentId)
  const directChannel = propChannels.find((c) => c.name === 'Venda Direta')

  const totalFixed = useMemo(() => propFixed.reduce((s, c) => s + c.amount, 0), [propFixed])
  const allocation = useMemo(
    () => allocateFixedCosts(propCategories, totalFixed),
    [propCategories, totalFixed],
  )

  const basePrices = useMemo(() => {
    if (!property || !selectedCategory) return null
    const allocated = allocation[selectedCategory.id] ?? 0
    return calculateCategoryScenarioPrices(
      selectedCategory,
      allocated,
      property,
      50,
      directChannel,
      selectedPayment,
    )
  }, [property, selectedCategory, allocation, directChannel, selectedPayment])

  if (!property || !basePrices || !selectedCategory) return null

  const priceCards = [
    {
      label: 'Preço de Emergência',
      price: basePrices.emergencyPrice,
      color: 'rose',
      icon: XOctagon,
      desc: 'Abaixo disso é prejuízo',
    },
    {
      label: 'Preço Sustentável',
      price: basePrices.sustainablePrice,
      color: 'amber',
      icon: AlertTriangle,
      desc: 'Ponto de equilíbrio',
    },
    {
      label: 'Preço Ideal',
      price: basePrices.idealPrice,
      color: 'emerald',
      icon: CheckCircle2,
      desc: `Foco (${property.desiredMargin}%)`,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comercial & Formação de Preços</h1>
        <p className="text-muted-foreground">Preços de referência por categoria de quarto.</p>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-2 w-64">
          <Label>Categoria de Quarto</Label>
          <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {propCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name} ({cat.unitCount} un.)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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

      <div className="grid gap-6 md:grid-cols-3">
        {priceCards.map((card) => (
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
          <CardTitle>Cenários por Categoria</CardTitle>
          <CardDescription>
            Preço ideal para cada categoria em diferentes níveis de ocupação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CategoryPriceTable
            property={property}
            categories={propCategories}
            fixedCosts={propFixed}
            channel={directChannel}
            paymentMethod={selectedPayment}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comparação de Canais — {selectedCategory.name}</CardTitle>
          <CardDescription>
            Impacto de comissões e taxas no preço ideal da categoria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Canal</TableHead>
                <TableHead className="text-right">Comissão</TableHead>
                <TableHead className="text-right">Preço Sugerido</TableHead>
                <TableHead className="text-right">Receita Líquida</TableHead>
                <TableHead className="text-right">Consumo da Margem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {propChannels.map((channel) => {
                const allocated = allocation[selectedCategory.id] ?? 0
                const result = calculateCategoryScenarioPrices(
                  selectedCategory,
                  allocated,
                  property,
                  50,
                  channel,
                  selectedPayment,
                )
                const netRevenue =
                  result.idealPrice *
                  (1 -
                    channel.commissionPercent / 100 -
                    (selectedPayment?.feePercent ?? 0) / 100 -
                    property.taxRegime / 100)
                const marginConsumed =
                  result.idealPrice > 0 ? (1 - netRevenue / result.idealPrice) * 100 : 0
                return (
                  <TableRow key={channel.id}>
                    <TableCell className="font-medium">{channel.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={channel.commissionPercent > 0 ? 'secondary' : 'default'}>
                        {formatPercent(channel.commissionPercent)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {formatCurrency(result.idealPrice)}
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
    </div>
  )
}
