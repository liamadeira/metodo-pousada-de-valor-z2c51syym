export interface Property {
  id: string
  name: string
  rooms: number
  taxRegime: number // percentage (e.g., 6 for 6%)
  desiredMargin: number // percentage
  currency: string
}

export interface FixedCost {
  id: string
  propertyId: string
  name: string
  amount: number
  category: string
}

export interface VariableCost {
  id: string
  propertyId: string
  name: string
  amountPerGuest: number
  amountPerStay: number
}

export interface Channel {
  id: string
  propertyId: string
  name: string
  commissionPercent: number
  fixedFee: number
}

export interface Reservation {
  id: string
  propertyId: string
  channelId: string
  checkIn: string
  checkOut: string
  revenue: number
  guests: number
  rooms: number
}

const DAYS_IN_MONTH = 30

export function calculatePrices(
  property: Property,
  fixedCosts: FixedCost[],
  variableCosts: VariableCost[],
) {
  const availableRooms = property.rooms * DAYS_IN_MONTH
  const totalFixed = fixedCosts.reduce((sum, c) => sum + c.amount, 0)
  const fixedAlloc = availableRooms > 0 ? totalFixed / availableRooms : 0

  // Assuming 2 guests per room for base calculations
  const cvPerRoom = variableCosts.reduce(
    (sum, c) => sum + c.amountPerStay + c.amountPerGuest * 2,
    0,
  )

  const taxRate = property.taxRegime / 100
  const marginRate = property.desiredMargin / 100

  const maxDiv = 0.99 // Cap to prevent division by zero

  const emergencyDiv = Math.max(1 - taxRate, 1 - maxDiv)
  const emergencyPrice = cvPerRoom / emergencyDiv

  const sustainableDiv = Math.max(1 - taxRate, 1 - maxDiv)
  const sustainablePrice = (cvPerRoom + fixedAlloc) / sustainableDiv

  const idealDiv = Math.max(1 - taxRate - marginRate, 1 - maxDiv)
  const idealPrice = (cvPerRoom + fixedAlloc) / idealDiv

  // Break-even (Ponto de Equilíbrio em Diárias)
  // Assuming ADR is the ideal price for this calculation baseline
  const breakEvenRooms =
    idealPrice - cvPerRoom - idealPrice * taxRate > 0
      ? totalFixed / (idealPrice - cvPerRoom - idealPrice * taxRate)
      : 0

  return {
    emergencyPrice,
    sustainablePrice,
    idealPrice,
    fixedAllocation: fixedAlloc,
    variablePerRoom: cvPerRoom,
    totalFixed,
    breakEvenRooms,
  }
}

export function calculateMetrics(
  property: Property,
  reservations: Reservation[],
  fixedCosts: FixedCost[],
  variableCosts: VariableCost[],
) {
  const availableRoomNights = property.rooms * DAYS_IN_MONTH

  const occupiedRoomNights = reservations.reduce((acc, r) => {
    const start = new Date(r.checkIn)
    const end = new Date(r.checkOut)
    const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
    return acc + r.rooms * days
  }, 0)

  const occupancyRate =
    availableRoomNights > 0 ? (occupiedRoomNights / availableRoomNights) * 100 : 0

  const totalRevenue = reservations.reduce((acc, r) => acc + r.revenue, 0)
  const adr = occupiedRoomNights > 0 ? totalRevenue / occupiedRoomNights : 0
  const revPar = availableRoomNights > 0 ? totalRevenue / availableRoomNights : 0

  const totalFixedCosts = fixedCosts.reduce((acc, c) => acc + c.amount, 0)

  // More accurate variable cost based on actual guests and stays
  const totalVariableCosts = reservations.reduce((acc, r) => {
    const vc = variableCosts.reduce(
      (sum, c) => sum + c.amountPerStay * r.rooms + c.amountPerGuest * r.guests,
      0,
    )
    return acc + vc
  }, 0)

  const taxes = totalRevenue * (property.taxRegime / 100)
  const netProfit = totalRevenue - totalFixedCosts - totalVariableCosts - taxes

  return {
    availableRoomNights,
    occupiedRoomNights,
    occupancyRate,
    totalRevenue,
    adr,
    revPar,
    totalFixedCosts,
    totalVariableCosts,
    taxes,
    netProfit,
  }
}
