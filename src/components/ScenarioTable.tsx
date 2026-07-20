import {
  calculateScenarioPrices,
  type Property,
  type FixedCost,
  type VariableCost,
  type Channel,
  type PaymentMethod,
} from '@/lib/calculations'
import { formatCurrency } from '@/lib/formatters'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface ScenarioTableProps {
  property: Property
  fixedCosts: FixedCost[]
  variableCosts: VariableCost[]
  scenarios: { name: string; occupancyRate: number }[]
  channel?: Channel
  paymentMethod?: PaymentMethod
}

export function ScenarioTable({
  property,
  fixedCosts,
  variableCosts,
  scenarios,
  channel,
  paymentMethod,
}: ScenarioTableProps) {
  const results = scenarios.map((s) => ({
    ...s,
    result: calculateScenarioPrices(
      property,
      fixedCosts,
      variableCosts,
      s.occupancyRate,
      channel,
      paymentMethod,
    ),
  }))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cenário</TableHead>
          <TableHead className="text-right">Ocupação</TableHead>
          <TableHead className="text-right">Diárias</TableHead>
          <TableHead className="text-right">Custo Fixo/Diária</TableHead>
          <TableHead className="text-right">Sustentável</TableHead>
          <TableHead className="text-right">Ideal</TableHead>
          <TableHead className="text-right">Lucro</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((r) => (
          <TableRow key={r.name}>
            <TableCell className="font-medium">{r.name}</TableCell>
            <TableCell className="text-right">{r.occupancyRate}%</TableCell>
            <TableCell className="text-right">{Math.round(r.result.soldDays)}</TableCell>
            <TableCell className="text-right">
              {formatCurrency(r.result.fixedCostAbsorption)}
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="outline" className="border-amber-500 text-amber-700">
                {formatCurrency(r.result.sustainablePrice)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <Badge variant="outline" className="border-emerald-500 text-emerald-700">
                {formatCurrency(r.result.idealPrice)}
              </Badge>
            </TableCell>
            <TableCell
              className={`text-right font-bold ${r.result.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
            >
              {formatCurrency(r.result.profit)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
