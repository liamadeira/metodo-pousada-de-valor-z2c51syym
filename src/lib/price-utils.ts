export type PriceStatus = 'red' | 'yellow' | 'green'

export interface PriceEvaluation {
  status: PriceStatus
  label: string
  description: string
  colorClass: string
  bgClass: string
  borderClass: string
  textColorClass: string
}

export function evaluatePrice(
  price: number,
  sustainablePrice: number,
  idealPrice: number,
): PriceEvaluation {
  if (price >= idealPrice) {
    return {
      status: 'green',
      label: 'Margem Ideal',
      description: 'Preço atinge ou supera a margem de lucro desejada.',
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderClass: 'border-emerald-200 dark:border-emerald-900',
      textColorClass: 'text-emerald-700 dark:text-emerald-400',
    }
  }
  if (price >= sustainablePrice) {
    return {
      status: 'yellow',
      label: 'Cobre Custos',
      description: 'Preço cobre custos fixos e variáveis, mas não atinge a margem desejada.',
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50 dark:bg-amber-950/20',
      borderClass: 'border-amber-200 dark:border-amber-900',
      textColorClass: 'text-amber-700 dark:text-amber-400',
    }
  }
  return {
    status: 'red',
    label: 'Insuficiente',
    description: 'Preço abaixo do sustentável. Operando com prejuízo.',
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50 dark:bg-rose-950/20',
    borderClass: 'border-rose-200 dark:border-rose-900',
    textColorClass: 'text-rose-700 dark:text-rose-400',
  }
}

export function getPriceStatusColor(status: PriceStatus): string {
  switch (status) {
    case 'green':
      return 'text-emerald-600'
    case 'yellow':
      return 'text-amber-600'
    case 'red':
      return 'text-rose-600'
  }
}

export function evaluatePriceWithEmergency(
  price: number,
  emergencyPrice: number,
  sustainablePrice: number,
  idealPrice: number,
): PriceEvaluation {
  if (price >= idealPrice) {
    return {
      status: 'green',
      label: 'Margem Ideal',
      description: 'Preço atinge ou supera a margem de lucro desejada.',
      colorClass: 'text-emerald-600',
      bgClass: 'bg-emerald-50 dark:bg-emerald-950/20',
      borderClass: 'border-emerald-200 dark:border-emerald-900',
      textColorClass: 'text-emerald-700 dark:text-emerald-400',
    }
  }
  if (price >= sustainablePrice) {
    return {
      status: 'yellow',
      label: 'Acima do Sustentável',
      description: 'Preço cobre todos os custos mas não atinge a margem desejada.',
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50 dark:bg-amber-950/20',
      borderClass: 'border-amber-200 dark:border-amber-900',
      textColorClass: 'text-amber-700 dark:text-amber-400',
    }
  }
  if (price >= emergencyPrice) {
    return {
      status: 'yellow',
      label: 'Zona de Risco',
      description:
        'Preço entre emergência e sustentável. Cobre custos variáveis mas não todos os fixos.',
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50 dark:bg-amber-950/20',
      borderClass: 'border-amber-200 dark:border-amber-900',
      textColorClass: 'text-amber-700 dark:text-amber-400',
    }
  }
  return {
    status: 'red',
    label: 'Insuficiente',
    description: 'Preço abaixo do emergencial. Operando com prejuízo.',
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50 dark:bg-rose-950/20',
    borderClass: 'border-rose-200 dark:border-rose-900',
    textColorClass: 'text-rose-700 dark:text-rose-400',
  }
}
