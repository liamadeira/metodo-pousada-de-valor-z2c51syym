import type { LaundryPiece, LaundryKit, BreakfastSetting } from '@/lib/calculations'

export function calculateLaundryCostPerChange(kit: LaundryKit, pieces: LaundryPiece[]): number {
  switch (kit.calculationMethod) {
    case 'average':
      return kit.averageCostPerChange
    case 'weight':
      return kit.weightCostPerKg * kit.averageWeightPerChange
    case 'kit':
    case 'piece':
      return kit.pieces.reduce((sum, kp) => {
        const piece = pieces.find((p) => p.id === kp.pieceId)
        return sum + (piece ? piece.costPerUnit * kp.quantity : 0)
      }, 0)
    default:
      return 0
  }
}

export function calculateLaundryChanges(stayNights: number, changeFrequency: number): number {
  if (changeFrequency <= 0) return 1
  return Math.ceil(stayNights / changeFrequency)
}

export function calculateLaundryCostForStay(
  kit: LaundryKit,
  pieces: LaundryPiece[],
  stayNights: number,
): number {
  const changes = calculateLaundryChanges(stayNights, kit.changeFrequencyNights)
  const costPerChange = calculateLaundryCostPerChange(kit, pieces)
  return costPerChange * changes
}

export function calculateLaundryCostPerDay(
  kit: LaundryKit,
  pieces: LaundryPiece[],
  averageStayNights: number,
): number {
  if (averageStayNights <= 0) return 0
  return calculateLaundryCostForStay(kit, pieces, averageStayNights) / averageStayNights
}

export function calculateBreakfastCost(
  setting: BreakfastSetting,
  guests: number,
  rooms: number,
): number {
  switch (setting.costingMethod) {
    case 'per_person':
      return setting.costPerPerson * guests
    case 'per_room':
      return setting.costPerRoom * rooms
    case 'component':
      return setting.components.reduce((sum, c) => sum + c.cost * c.quantityPerPerson * guests, 0)
    default:
      return 0
  }
}

export function calculateBreakfastCostPerDay(
  setting: BreakfastSetting,
  guestsPerRoom: number = 2,
): number {
  return calculateBreakfastCost(setting, guestsPerRoom, 1)
}
