export interface Property {
  id: string
  name: string
  rooms: number
  blockedRooms: number
  periodDays: number
  taxRegime: number
  desiredMargin: number
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

export interface PaymentMethod {
  id: string
  propertyId: string
  name: string
  feePercent: number
  fixedFee: number
}

export interface Scenario {
  id: string
  propertyId: string
  name: string
  occupancyRate: number
  isDefault: boolean
}

export interface LaundryPiece {
  id: string
  name: string
  pieceType: string
  costPerUnit: number
}

export interface LaundryKitPiece {
  pieceId: string
  quantity: number
}

export interface LaundryKit {
  id: string
  propertyId: string
  name: string
  changeFrequencyNights: number
  calculationMethod: 'piece' | 'weight' | 'kit' | 'average'
  averageCostPerChange: number
  weightCostPerKg: number
  averageWeightPerChange: number
  pieces: LaundryKitPiece[]
}

export interface BreakfastComponent {
  id: string
  name: string
  cost: number
  quantityPerPerson: number
}

export interface BreakfastSetting {
  id: string
  propertyId: string
  costingMethod: 'per_person' | 'per_room' | 'component'
  costPerPerson: number
  costPerRoom: number
  components: BreakfastComponent[]
}

export interface SavedSimulation {
  id: string
  propertyId: string
  name: string
  mode: 'direct' | 'reverse'
  occupancy: number
  price: number
  channelId: string
  paymentMethodId: string
}

export interface ScenarioResult {
  availableDays: number
  soldDays: number
  fixedCostAbsorption: number
  variableCostPerDay: number
  emergencyPrice: number
  sustainablePrice: number
  idealPrice: number
  totalFixed: number
  revenue: number
  profit: number
  margin: number
}

const DEFAULT_GUESTS_PER_ROOM = 2

export function calculateAvailableDays(property: Property): number {
  const totalRoomDays = property.rooms * property.periodDays
  const blockedRoomDays = property.blockedRooms * property.periodDays
  return Math.max(0, totalRoomDays - blockedRoomDays)
}

export function calculateVariableCostPerDay(variableCosts: VariableCost[]): number {
  return variableCosts.reduce(
    (sum, c) => sum + c.amountPerStay + c.amountPerGuest * DEFAULT_GUESTS_PER_ROOM,
    0,
  )
}

export function calculateScenarioPrices(
  property: Property,
  fixedCosts: FixedCost[],
  variableCosts: VariableCost[],
  occupancyRate: number,
  channel?: Channel,
  paymentMethod?: PaymentMethod,
): ScenarioResult {
  const availableDays = calculateAvailableDays(property)
  const soldDays = availableDays * (occupancyRate / 100)
  const totalFixed = fixedCosts.reduce((sum, c) => sum + c.amount, 0)
  const fixedCostAbsorption = soldDays > 0 ? totalFixed / soldDays : 0
  const variableCostPerDay = calculateVariableCostPerDay(variableCosts)
  const commissionRate = (channel?.commissionPercent ?? 0) / 100
  const paymentFeeRate = (paymentMethod?.feePercent ?? 0) / 100
  const taxRate = property.taxRegime / 100
  const marginRate = property.desiredMargin / 100
  const totalDeduction = taxRate + commissionRate + paymentFeeRate

  const sustainableDenom = Math.max(1 - totalDeduction, 0.01)
  const sustainablePrice = (fixedCostAbsorption + variableCostPerDay) / sustainableDenom
  const idealDenom = Math.max(1 - totalDeduction - marginRate, 0.01)
  const idealPrice = (fixedCostAbsorption + variableCostPerDay) / idealDenom
  const emergencyDenom = Math.max(1 - taxRate, 0.01)
  const emergencyPrice = variableCostPerDay / emergencyDenom

  const revenue = soldDays * idealPrice
  const commission = revenue * commissionRate
  const paymentFee = revenue * paymentFeeRate
  const taxes = revenue * taxRate
  const variableTotal = soldDays * variableCostPerDay
  const profit = revenue - totalFixed - variableTotal - commission - paymentFee - taxes
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0

  return {
    availableDays,
    soldDays,
    fixedCostAbsorption,
    variableCostPerDay,
    emergencyPrice,
    sustainablePrice,
    idealPrice,
    totalFixed,
    revenue,
    profit,
    margin,
  }
}

export interface ReverseResult {
  netRevenuePerDay: number
  contributionMargin: number
  equilibriumOccupancy: number
  marginAtTarget: number
  profitAtTarget: number
  commissionAmount: number
  paymentFeeAmount: number
  taxAmount: number
  status: 'red' | 'yellow' | 'green'
}

export function calculateReverseSimulation(
  property: Property,
  fixedCosts: FixedCost[],
  variableCosts: VariableCost[],
  grossPrice: number,
  targetOccupancy: number,
  channel?: Channel,
  paymentMethod?: PaymentMethod,
  sustainablePrice?: number,
  idealPrice?: number,
): ReverseResult {
  const availableDays = calculateAvailableDays(property)
  const totalFixed = fixedCosts.reduce((sum, c) => sum + c.amount, 0)
  const variableCostPerDay = calculateVariableCostPerDay(variableCosts)
  const commissionRate = (channel?.commissionPercent ?? 0) / 100
  const paymentFeeRate = (paymentMethod?.feePercent ?? 0) / 100
  const taxRate = property.taxRegime / 100

  const commissionAmount = grossPrice * commissionRate
  const paymentFeeAmount = grossPrice * paymentFeeRate
  const taxAmount = grossPrice * taxRate
  const netRevenuePerDay = grossPrice - commissionAmount - paymentFeeAmount - taxAmount
  const contributionMargin = netRevenuePerDay - variableCostPerDay
  const equilibriumOccupancy =
    contributionMargin > 0 ? (totalFixed / contributionMargin / availableDays) * 100 : 100

  const soldDaysAtTarget = availableDays * (targetOccupancy / 100)
  const profitAtTarget = contributionMargin * soldDaysAtTarget - totalFixed
  const fixedAbsorptionAtTarget = soldDaysAtTarget > 0 ? totalFixed / soldDaysAtTarget : totalFixed
  const marginAtTarget =
    grossPrice > 0
      ? ((netRevenuePerDay - variableCostPerDay - fixedAbsorptionAtTarget) / grossPrice) * 100
      : 0

  let status: 'red' | 'yellow' | 'green' = 'red'
  if (sustainablePrice && idealPrice) {
    if (grossPrice >= idealPrice) status = 'green'
    else if (grossPrice >= sustainablePrice) status = 'yellow'
  }

  return {
    netRevenuePerDay,
    contributionMargin,
    equilibriumOccupancy: Math.min(equilibriumOccupancy, 100),
    marginAtTarget,
    profitAtTarget,
    commissionAmount,
    paymentFeeAmount,
    taxAmount,
    status,
  }
}

export function calculateEmptyRoomCost(property: Property, fixedCosts: FixedCost[]): number {
  const availableDays = calculateAvailableDays(property)
  const totalFixed = fixedCosts.reduce((sum, c) => sum + c.amount, 0)
  return availableDays > 0 ? totalFixed / availableDays : 0
}

export function calculateEquilibriumOccupancy(
  property: Property,
  fixedCosts: FixedCost[],
  variableCosts: VariableCost[],
  grossPrice: number,
  channel?: Channel,
  paymentMethod?: PaymentMethod,
): number {
  const availableDays = calculateAvailableDays(property)
  const totalFixed = fixedCosts.reduce((sum, c) => sum + c.amount, 0)
  const variableCostPerDay = calculateVariableCostPerDay(variableCosts)
  const commissionRate = (channel?.commissionPercent ?? 0) / 100
  const paymentFeeRate = (paymentMethod?.feePercent ?? 0) / 100
  const taxRate = property.taxRegime / 100
  const netRevenue = grossPrice * (1 - commissionRate - paymentFeeRate - taxRate)
  const contributionMargin = netRevenue - variableCostPerDay
  if (contributionMargin <= 0) return 100
  return Math.min((totalFixed / contributionMargin / availableDays) * 100, 100)
}
