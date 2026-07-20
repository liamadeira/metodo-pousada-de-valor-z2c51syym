import React, { createContext, useContext, useState, useEffect } from 'react'
import {
  Property,
  FixedCost,
  VariableCost,
  Channel,
  PaymentMethod,
  Scenario,
  LaundryPiece,
  LaundryKit,
  BreakfastSetting,
  SavedSimulation,
  RoomCategory,
} from '@/lib/calculations'
import {
  initialProperties,
  initialFixedCosts,
  initialVariableCosts,
  initialChannels,
  initialPaymentMethods,
  initialScenarios,
  initialLaundryPieces,
  initialLaundryKits,
  initialBreakfastSettings,
  initialRoomCategories,
} from '@/lib/mock-data'

interface AppState {
  isLoading: boolean
  properties: Property[]
  currentPropertyId: string
  setCurrentPropertyId: (id: string) => void
  updateProperty: (id: string, data: Partial<Property>) => void
  fixedCosts: FixedCost[]
  addFixedCost: (cost: Omit<FixedCost, 'id'>) => void
  variableCosts: VariableCost[]
  addVariableCost: (cost: Omit<VariableCost, 'id'>) => void
  channels: Channel[]
  paymentMethods: PaymentMethod[]
  scenarios: Scenario[]
  addScenario: (s: Omit<Scenario, 'id'>) => void
  duplicateScenario: (id: string) => void
  deleteScenario: (id: string) => void
  laundryPieces: LaundryPiece[]
  laundryKits: LaundryKit[]
  breakfastSettings: BreakfastSetting[]
  savedSimulations: SavedSimulation[]
  addSavedSimulation: (s: Omit<SavedSimulation, 'id'>) => void
  roomCategories: RoomCategory[]
  addRoomCategory: (cat: Omit<RoomCategory, 'id'>) => void
  updateRoomCategory: (id: string, data: Partial<RoomCategory>) => void
  deleteRoomCategory: (id: string) => void
}

const genId = () => Math.random().toString(36).substr(2, 9)
const AppStoreContext = createContext<AppState | null>(null)

export const AppStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [properties, setProperties] = useState<Property[]>(initialProperties)
  const [currentPropertyId, setCurrentPropertyId] = useState(initialProperties[0].id)
  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>(initialFixedCosts)
  const [variableCosts, setVariableCosts] = useState<VariableCost[]>(initialVariableCosts)
  const [channels] = useState<Channel[]>(initialChannels)
  const [paymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  const [scenarios, setScenarios] = useState<Scenario[]>(initialScenarios)
  const [laundryPieces] = useState<LaundryPiece[]>(initialLaundryPieces)
  const [laundryKits] = useState<LaundryKit[]>(initialLaundryKits)
  const [breakfastSettings] = useState<BreakfastSetting[]>(initialBreakfastSettings)
  const [savedSimulations, setSavedSimulations] = useState<SavedSimulation[]>([])
  const [roomCategories, setRoomCategories] = useState<RoomCategory[]>(initialRoomCategories)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const updateProperty = (id: string, data: Partial<Property>) =>
    setProperties((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
  const addFixedCost = (cost: Omit<FixedCost, 'id'>) =>
    setFixedCosts((prev) => [...prev, { ...cost, id: genId() }])
  const addVariableCost = (cost: Omit<VariableCost, 'id'>) =>
    setVariableCosts((prev) => [...prev, { ...cost, id: genId() }])
  const addScenario = (s: Omit<Scenario, 'id'>) =>
    setScenarios((prev) => [...prev, { ...s, id: genId() }])
  const duplicateScenario = (id: string) => {
    const sc = scenarios.find((s) => s.id === id)
    if (sc)
      setScenarios((prev) => [
        ...prev,
        { ...sc, id: genId(), name: `${sc.name} (Cópia)`, isDefault: false },
      ])
  }
  const deleteScenario = (id: string) => setScenarios((prev) => prev.filter((s) => s.id !== id))
  const addSavedSimulation = (s: Omit<SavedSimulation, 'id'>) =>
    setSavedSimulations((prev) => [...prev, { ...s, id: genId() }])
  const addRoomCategory = (cat: Omit<RoomCategory, 'id'>) =>
    setRoomCategories((prev) => [...prev, { ...cat, id: genId() }])
  const updateRoomCategory = (id: string, data: Partial<RoomCategory>) =>
    setRoomCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)))
  const deleteRoomCategory = (id: string) =>
    setRoomCategories((prev) => prev.filter((c) => c.id !== id))

  const value: AppState = {
    isLoading,
    properties,
    currentPropertyId,
    setCurrentPropertyId,
    updateProperty,
    fixedCosts,
    addFixedCost,
    variableCosts,
    addVariableCost,
    channels,
    paymentMethods,
    scenarios,
    addScenario,
    duplicateScenario,
    deleteScenario,
    laundryPieces,
    laundryKits,
    breakfastSettings,
    savedSimulations,
    addSavedSimulation,
    roomCategories,
    addRoomCategory,
    updateRoomCategory,
    deleteRoomCategory,
  }

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>
}

export default function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider')
  return ctx
}
