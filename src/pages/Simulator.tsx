import { useState, useMemo } from 'react'
import useAppStore from '@/stores/use-app-store'
import {
  calculateCategoryScenarioPrices,
  calculateCategoryReverseSimulation,
  allocateFixedCosts,
} from '@/lib/calculations'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { evaluatePriceWithEmergency } from '@/lib/price-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SmartAlert } from '@/components/SmartAlert'

export default function Simulator() {
  const { properties, currentPropertyId, fixedCosts, channels, paymentMethods, roomCategories } =
    useAppStore()
  const property = properties.find((p) => p.id === currentPropertyId)
  const propFixed = fixedCosts.filter((c) => c.propertyId === currentPropertyId)
  const propCategories = roomCategories.filter((c) => c.propertyId === currentPropertyId)
  const propChannels = channels.filter((c) => c.propertyId === currentPropertyId)
  const propPayments = paymentMethods.filter((pm) => pm.propertyId === currentPropertyId)

  const [mode, setMode] = useState<'direct' | 'reverse'>('direct')
  const [occupancy, setOccupancy] = useState(50)
  const [margin, setMargin] = useState(property?.desiredMargin ?? 20)
  const [testPrice, setTestPrice] = useState(300)
  const [categoryId, setCategoryId] = useState(propCategories[0]?.id ?? '')
  const [channelId, setChannelId] = useState(propChannels[0]?.id ?? '')
  const [paymentId, setPaymentId] = useState(propPayments[0]?.id ?? '')

  const selectedCategory = propCategories.find((c) => c.id === categoryId)
  const selectedChannel = propChannels.find((c) => c.id === channelId)
  const selectedPayment = propPayments.find((pm) => pm.id === paymentId)

  const totalFixed = useMemo(() => propFixed.reduce((s, c) => s + c.amount, 0), [propFixed])
  const allocation = useMemo(
    () => allocateFixedCosts(propCategories, totalFixed),
    [propCategories, totalFixed],
  )

  const directResult = useMemo(() => {
    if (!property || !selectedCategory) return null
    const allocated = allocation[selectedCategory.id] ?? 0
    return calculateCategoryScenarioPrices(
      selectedCategory,
      allocated,
      { ...property, desiredMargin: margin },
      occupancy,
      selectedChannel,
      selectedPayment,
    )
  }, [property, selectedCategory, allocation, occupancy, margin, selectedChannel, selectedPayment])

  const reverseResult = useMemo(() => {
    if (!property || !selectedCategory || !directResult) return null
    const allocated = allocation[selectedCategory.id] ?? 0
    return calculateCategoryReverseSimulation(
      selectedCategory,
      allocated,
      { ...property, desiredMargin: margin },
      testPrice,
      occupancy,
      selectedChannel,
      selectedPayment,
      directResult.sustainablePrice,
      directResult.idealPrice,
      directResult.emergencyPrice,
    )
  }, [
    property,
    selectedCategory,
    allocation,
    testPrice,
    occupancy,
    selectedChannel,
    selectedPayment,
    directResult,
    margin,
  ])

  if (!property || !directResult || !reverseResult || !selectedCategory) return null

  const evaluation = evaluatePriceWithEmergency(
    testPrice,
    directResult.emergencyPrice,
    directResult.sustainablePrice,
    directResult.idealPrice,
  )

  const categorySelect = (
    <div className="space-y-2">
      <Label>Categoria de Quarto</Label>
      <Select value={categoryId} onValueChange={setCategoryId}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {propCategories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name} ({c.unitCount} un.)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
  const channelSelect = (
    <div className="space-y-2">
      <Label>Canal de Venda</Label>
      <Select value={channelId} onValueChange={setChannelId}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {propChannels.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name} ({c.commissionPercent}%)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
  const paymentSelect = (
    <div className="space-y-2">
      <Label>Forma de Pagamento</Label>
      <Select value={paymentId} onValueChange={setPaymentId}>
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
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Simulador de Preços por Categoria</h1>
        <p className="text-muted-foreground">
          Simulação direta ou reversa para cada tipo de quarto.
        </p>
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as 'direct' | 'reverse')}>
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="direct">Encontrar Preço</TabsTrigger>
          <TabsTrigger value="reverse">Testar Preço</TabsTrigger>
        </TabsList>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>{mode === 'direct' ? 'Variáveis de Cálculo' : 'Preço de Teste'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {categorySelect}
              {mode === 'direct' ? (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base">Ocupação Alvo</Label>
                      <span className="font-bold text-primary">{occupancy}%</span>
                    </div>
                    <Slider
                      value={[occupancy]}
                      onValueChange={(v) => setOccupancy(v[0])}
                      min={20}
                      max={100}
                      step={5}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base">Margem Desejada</Label>
                      <span className="font-bold text-primary">{margin}%</span>
                    </div>
                    <Slider
                      value={[margin]}
                      onValueChange={(v) => setMargin(v[0])}
                      min={0}
                      max={50}
                      step={1}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base">Preço Testado (ADR)</Label>
                      <span className="font-bold text-primary">{formatCurrency(testPrice)}</span>
                    </div>
                    <Slider
                      value={[testPrice]}
                      onValueChange={(v) => setTestPrice(v[0])}
                      min={50}
                      max={2000}
                      step={10}
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label className="text-base">Ocupação de Referência</Label>
                      <span className="font-bold text-primary">{occupancy}%</span>
                    </div>
                    <Slider
                      value={[occupancy]}
                      onValueChange={(v) => setOccupancy(v[0])}
                      min={20}
                      max={100}
                      step={5}
                    />
                  </div>
                </>
              )}
              {channelSelect}
              {paymentSelect}
            </CardContent>
          </Card>

          <TabsContent value="direct" className="mt-0">
            <Card className="bg-slate-900 text-slate-50 dark:bg-card dark:text-card-foreground">
              <CardHeader>
                <CardTitle>Preços Recomendados — {selectedCategory.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b border-slate-800 dark:border-border pb-3">
                  <span className="text-slate-300">Emergência</span>
                  <span className="font-bold text-rose-400">
                    {formatCurrency(directResult.emergencyPrice)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 dark:border-border pb-3">
                  <span className="text-slate-300">Sustentável</span>
                  <span className="font-bold text-amber-400">
                    {formatCurrency(directResult.sustainablePrice)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 dark:border-border pb-3">
                  <span className="text-slate-300">Ideal ({margin}%)</span>
                  <span className="font-bold text-emerald-400">
                    {formatCurrency(directResult.idealPrice)}
                  </span>
                </div>
                <div className="pt-2 space-y-2 text-sm text-slate-400 dark:text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Diárias vendidas (sim.)</span>
                    <span>{Math.round(directResult.soldDays)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custo fixo alocado/diária</span>
                    <span>{formatCurrency(directResult.fixedCostAbsorption)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custo variável/diária</span>
                    <span>{formatCurrency(directResult.variableCostPerDay)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lucro projetado</span>
                    <span
                      className={directResult.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}
                    >
                      {formatCurrency(directResult.profit)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reverse" className="mt-0 space-y-4">
            <SmartAlert
              status={reverseResult.status}
              title={`Avaliação: ${evaluation.label}`}
              description={evaluation.description}
            />
            <Card>
              <CardHeader>
                <CardTitle>Análise do Preço — {selectedCategory.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Receita Líquida/Diária</span>
                  <span className="font-bold">
                    {formatCurrency(reverseResult.netRevenuePerDay)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Margem de Contribuição</span>
                  <span className="font-bold">
                    {formatCurrency(reverseResult.contributionMargin)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Ocupação de Equilíbrio</span>
                  <span
                    className={`font-bold ${reverseResult.equilibriumOccupancy > 70 ? 'text-rose-600' : 'text-emerald-600'}`}
                  >
                    {formatPercent(reverseResult.equilibriumOccupancy)}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Lucro a {occupancy}%</span>
                  <span
                    className={`font-bold ${reverseResult.profitAtTarget >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                  >
                    {formatCurrency(reverseResult.profitAtTarget)}
                  </span>
                </div>
                <div className="pt-2 space-y-1 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>(-) Comissão</span>
                    <span>{formatCurrency(reverseResult.commissionAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>(-) Taxa pagamento</span>
                    <span>{formatCurrency(reverseResult.paymentFeeAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>(-) Impostos</span>
                    <span>{formatCurrency(reverseResult.taxAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
