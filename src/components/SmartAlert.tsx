import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PriceStatus } from '@/lib/price-utils'

interface SmartAlertProps {
  status: PriceStatus
  title: string
  description: string
}

export function SmartAlert({ status, title, description }: SmartAlertProps) {
  const Icon = status === 'green' ? CheckCircle2 : status === 'yellow' ? AlertTriangle : AlertCircle
  const variant = status === 'red' ? 'destructive' : 'default'
  return (
    <Alert
      variant={variant}
      className={cn(
        'border-l-4',
        status === 'green' && 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20',
        status === 'yellow' && 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/20',
        status === 'red' && 'border-l-rose-500',
      )}
    >
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  )
}
