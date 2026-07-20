import { useMemo } from 'react'
import {
  calculateCategoryScenarioPrices,
  allocateFixedCosts,
  type Property,
  type FixedCost,
  type RoomCategory,
  type Channel,
  type PaymentMethod,
} from '@/lib/calculations'
import { formatCurrency } from '@/lib/formatters'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface CategoryPriceTableProps {
  property: Property
  categories: RoomCategory[]
  fixedCosts: FixedCost[]
  channel?: Channel
  paymentMethod?: PaymentMethod
}

const OCCUPANCY_SCENARIOS = [30, 50, 70, 90]

export function CategoryPriceTable({
  property,
  categories,
  fixedCosts,
  channel,
  paymentMethod,
}: CategoryPriceTableProps) {
  const totalFixed = useMemo(() => fixedCosts.reduce((s, c) => s + c.amount, 0), [fixedCosts])
  const allocation = useMemo(
    () => allocateFixedCosts(categories, totalFixed),
    [categories, totalFixed],
  )

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[120px]">Categoria</TableHead>
          <TableHead className="text-center">Unidades</TableHead>
          {OCCUPANCY_SCENARIOS.map((occ) => (
            <TableHead key={occ} className="text-right">
              {occ}% Ocup.
            </TableHead>
          ))}
          <TableHead className="text-right">Emergência</TableHead>
          <TableHead className="text-right">Sustentável</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((cat) => {
          const allocated = allocation[cat.id] ?? 0
          const refResult = calculateCategoryScenarioPrices(
            cat,
            allocated,
            property,
            50,
            channel,
            paymentMethod,
          )
          return (
            <TableRow key={cat.id}>
              <TableCell className="font-medium">{cat.name}</TableCell>
              <TableCell className="text-center">{cat.unitCount}</TableCell>
              {OCCUPANCY_SCENARIOS.map((occ) => {
                const result = calculateCategoryScenarioPrices(
                  cat,
                  allocated,
                  property,
                  occ,
                  channel,
                  paymentMethod,
                )
                const colorClass =
                  occ >= 70 ? 'text-emerald-600' : occ >= 50 ? 'text-amber-600' : 'text-rose-600'
                return (
                  <TableCell key={occ} className={cn('text-right font-bold', colorClass)}>
                    {formatCurrency(result.idealPrice)}
                  </TableCell>
                )
              })}
              <TableCell className="text-right text-rose-600 font-medium">
                {formatCurrency(refResult.emergencyPrice)}
              </TableCell>
              <TableCell className="text-right text-amber-600 font-medium">
                {formatCurrency(refResult.sustainablePrice)}
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
