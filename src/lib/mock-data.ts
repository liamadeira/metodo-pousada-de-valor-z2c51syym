import type {
  Property,
  FixedCost,
  VariableCost,
  Channel,
  PaymentMethod,
  Scenario,
  LaundryPiece,
  LaundryKit,
  BreakfastSetting,
} from '@/lib/calculations'

export const initialProperties: Property[] = [
  {
    id: 'p1',
    name: 'Pousada Brisa do Mar',
    rooms: 15,
    blockedRooms: 1,
    periodDays: 30,
    taxRegime: 6,
    desiredMargin: 20,
    currency: 'BRL',
  },
]

export const initialFixedCosts: FixedCost[] = [
  { id: 'fc1', propertyId: 'p1', name: 'Aluguel', amount: 5000, category: 'Infraestrutura' },
  { id: 'fc2', propertyId: 'p1', name: 'Energia', amount: 1200, category: 'Utilidades' },
  { id: 'fc3', propertyId: 'p1', name: 'Equipe (Salários)', amount: 6500, category: 'Pessoal' },
  { id: 'fc4', propertyId: 'p1', name: 'Internet', amount: 200, category: 'Utilidades' },
  { id: 'fc5', propertyId: 'p1', name: 'Marketing', amount: 800, category: 'Comercial' },
]

export const initialVariableCosts: VariableCost[] = [
  { id: 'vc1', propertyId: 'p1', name: 'Lavanderia', amountPerGuest: 0, amountPerStay: 25 },
  { id: 'vc2', propertyId: 'p1', name: 'Café da Manhã', amountPerGuest: 18, amountPerStay: 0 },
  { id: 'vc3', propertyId: 'p1', name: 'Amenities', amountPerGuest: 8, amountPerStay: 0 },
  { id: 'vc4', propertyId: 'p1', name: 'Limpeza', amountPerGuest: 0, amountPerStay: 15 },
]

export const initialChannels: Channel[] = [
  { id: 'c1', propertyId: 'p1', name: 'Booking.com', commissionPercent: 15, fixedFee: 0 },
  { id: 'c2', propertyId: 'p1', name: 'Airbnb', commissionPercent: 14, fixedFee: 0 },
  { id: 'c3', propertyId: 'p1', name: 'Venda Direta', commissionPercent: 0, fixedFee: 0 },
]

export const initialPaymentMethods: PaymentMethod[] = [
  { id: 'pm1', propertyId: 'p1', name: 'Pix', feePercent: 0, fixedFee: 0 },
  { id: 'pm2', propertyId: 'p1', name: 'Cartão de Crédito', feePercent: 3.99, fixedFee: 0 },
  { id: 'pm3', propertyId: 'p1', name: 'Cartão de Débito', feePercent: 2.5, fixedFee: 0 },
  { id: 'pm4', propertyId: 'p1', name: 'Transferência', feePercent: 0, fixedFee: 5 },
]

export const initialScenarios: Scenario[] = [
  { id: 's1', propertyId: 'p1', name: 'Baixa Temporada', occupancyRate: 30, isDefault: true },
  { id: 's2', propertyId: 'p1', name: 'Média Temporada', occupancyRate: 50, isDefault: true },
  { id: 's3', propertyId: 'p1', name: 'Alta Temporada', occupancyRate: 70, isDefault: true },
  { id: 's4', propertyId: 'p1', name: 'Lotado', occupancyRate: 90, isDefault: true },
  { id: 's5', propertyId: 'p1', name: 'Capacidade Máxima', occupancyRate: 100, isDefault: false },
]

export const initialLaundryPieces: LaundryPiece[] = [
  { id: 'lp1', name: 'Lençol Casal King', pieceType: 'sheet', costPerUnit: 3.5 },
  { id: 'lp2', name: 'Lençol Casal Queen', pieceType: 'sheet', costPerUnit: 3.2 },
  { id: 'lp3', name: 'Lençol Solteiro', pieceType: 'sheet', costPerUnit: 2.5 },
  { id: 'lp4', name: 'Fronha', pieceType: 'pillowcase', costPerUnit: 1.0 },
  { id: 'lp5', name: 'Toalha de Banho', pieceType: 'towel', costPerUnit: 2.0 },
  { id: 'lp6', name: 'Toalha de Rosto', pieceType: 'towel', costPerUnit: 1.0 },
  { id: 'lp7', name: 'Tapete', pieceType: 'rug', costPerUnit: 1.5 },
  { id: 'lp8', name: 'Roupão', pieceType: 'robe', costPerUnit: 4.0 },
  { id: 'lp9', name: 'Capa de Edredom', pieceType: 'duvet', costPerUnit: 5.0 },
]

export const initialLaundryKits: LaundryKit[] = [
  {
    id: 'lk1',
    propertyId: 'p1',
    name: 'Kit Casal Standard',
    changeFrequencyNights: 3,
    calculationMethod: 'kit',
    averageCostPerChange: 0,
    weightCostPerKg: 0,
    averageWeightPerChange: 0,
    pieces: [
      { pieceId: 'lp2', quantity: 2 },
      { pieceId: 'lp4', quantity: 2 },
      { pieceId: 'lp5', quantity: 2 },
      { pieceId: 'lp6', quantity: 2 },
      { pieceId: 'lp7', quantity: 1 },
    ],
  },
]

export const initialBreakfastSettings: BreakfastSetting[] = [
  {
    id: 'bs1',
    propertyId: 'p1',
    costingMethod: 'per_person',
    costPerPerson: 18,
    costPerRoom: 0,
    components: [
      { id: 'bc1', name: 'Café', cost: 2, quantityPerPerson: 1 },
      { id: 'bc2', name: 'Leite', cost: 1.5, quantityPerPerson: 1 },
      { id: 'bc3', name: 'Pão', cost: 3, quantityPerPerson: 2 },
      { id: 'bc4', name: 'Fruta', cost: 2.5, quantityPerPerson: 1 },
      { id: 'bc5', name: 'Manteiga', cost: 1, quantityPerPerson: 1 },
    ],
  },
]
