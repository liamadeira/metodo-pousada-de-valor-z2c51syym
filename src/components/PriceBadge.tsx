import { formatCurrency } from '@/lib/formatters'
import { evaluatePrice } from '@/lib/price-utils'
import { cn } from '@/lib/utils'

interface PriceBadgeProps {
  price: number
  sustainablePrice: number
  idealPrice: number
  label?: string
}

export function PriceBadge({ price, sustainablePrice, idealPrice, label }: PriceBadgeProps) {
  const ev = evaluatePrice(price, sustainablePrice, idealPrice)
  return (
    <div className={cn('rounded-lg border p-4', ev.bgClass, ev.borderClass)}>
      {label && <p className="text-sm text-muted-foreground mb-1">{label}</p>}
      <div className={cn('text-2xl font-bold', ev.textColorClass)}>{formatCurrency(price)}</div>
      <p className={cn('text-xs mt-1', ev.textColorClass)}>{ev.label}</p>
    </div>
  )
}
