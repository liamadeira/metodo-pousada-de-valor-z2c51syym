import React, { createContext, useContext, useState, useEffect } from 'react'
import { Property, FixedCost, VariableCost, Channel, Reservation } from '@/lib/calculations'
import { format } from 'date-fns'

interface AppState {
  isLoading: boolean
  properties: Property[]
  currentPropertyId: string
  setCurrentPropertyId: (id: string) => void
  fixedCosts: FixedCost[]
  addFixedCost: (cost: Omit<FixedCost, 'id'>) => void
  variableCosts: VariableCost[]
  addVariableCost: (cost: Omit<VariableCost, 'id'>) => void
  channels: Channel[]
  reservations: Reservation[]
  addReservation: (res: Omit<Reservation, 'id'>) => void
  duplicateCostsFromLastMonth: () => void
}

const currentMonth = format(new Date(), 'yyyy-MM')

const initialProperties: Property[] = [
  {
    id: 'p1',
    name: 'Pousada Brisa do Mar',
    rooms: 15,
    taxRegime: 6,
    desiredMargin: 20,
    currency: 'BRL',
  },
]

const initialFixedCosts: FixedCost[] = [
  { id: 'fc1', propertyId: 'p1', name: 'Aluguel', amount: 5000, category: 'Infraestrutura' },
  { id: 'fc2', propertyId: 'p1', name: 'Energia', amount: 1200, category: 'Utilidades' },
  { id: 'fc3', propertyId: 'p1', name: 'Equipe (Salários)', amount: 6500, category: 'Pessoal' },
]

const initialVariableCosts: VariableCost[] = [
  { id: 'vc1', propertyId: 'p1', name: 'Lavanderia', amountPerGuest: 0, amountPerStay: 25 },
  { id: 'vc2', propertyId: 'p1', name: 'Café da Manhã', amountPerGuest: 18, amountPerStay: 0 },
  { id: 'vc3', propertyId: 'p1', name: 'Amenities', amountPerGuest: 8, amountPerStay: 0 },
]

const initialChannels: Channel[] = [
  { id: 'c1', propertyId: 'p1', name: 'Booking.com', commissionPercent: 15, fixedFee: 0 },
  { id: 'c2', propertyId: 'p1', name: 'Airbnb', commissionPercent: 14, fixedFee: 0 },
  { id: 'c3', propertyId: 'p1', name: 'Venda Direta', commissionPercent: 0, fixedFee: 0 },
]

const initialReservations: Reservation[] = [
  {
    id: 'r1',
    propertyId: 'p1',
    channelId: 'c1',
    checkIn: `${currentMonth}-05`,
    checkOut: `${currentMonth}-10`,
    revenue: 2500,
    guests: 2,
    rooms: 1,
  },
  {
    id: 'r2',
    propertyId: 'p1',
    channelId: 'c2',
    checkIn: `${currentMonth}-12`,
    checkOut: `${currentMonth}-15`,
    revenue: 1800,
    guests: 4,
    rooms: 2,
  },
  {
    id: 'r3',
    propertyId: 'p1',
    channelId: 'c3',
    checkIn: `${currentMonth}-20`,
    checkOut: `${currentMonth}-22`,
    revenue: 900,
    guests: 2,
    rooms: 1,
  },
]

const AppStoreContext = createContext<AppState | null>(null)

export const AppStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [currentPropertyId, setCurrentPropertyId] = useState<string>(initialProperties[0].id)
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>(initialFixedCosts)
  const [variableCosts, setVariableCosts] = useState<VariableCost[]>(initialVariableCosts)
  const [channels, setChannels] = useState<Channel[]>(initialChannels)
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const addFixedCost = (cost: Omit<FixedCost, 'id'>) => {
    setFixedCosts([...fixedCosts, { ...cost, id: Math.random().toString(36).substr(2, 9) }])
  }

  const addVariableCost = (cost: Omit<VariableCost, 'id'>) => {
    setVariableCosts([...variableCosts, { ...cost, id: Math.random().toString(36).substr(2, 9) }])
  }

  const addReservation = (res: Omit<Reservation, 'id'>) => {
    setReservations([...reservations, { ...res, id: Math.random().toString(36).substr(2, 9) }])
  }

  const duplicateCostsFromLastMonth = () => {
    setIsLoading(true)
    setTimeout(() => {
      // Dummy action, in reality it would duplicate records for the new month
      setIsLoading(false)
    }, 500)
  }

  const value = {
    isLoading,
    properties,
    currentPropertyId,
    setCurrentPropertyId,
    fixedCosts,
    addFixedCost,
    variableCosts,
    addVariableCost,
    channels,
    reservations,
    addReservation,
    duplicateCostsFromLastMonth,
  }

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export default function useAppStore() {
  const context = useContext(AppStoreContext)
  if (!context) throw new Error('useAppStore must be used within AppStoreProvider')
  return context
}
