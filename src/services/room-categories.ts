import pb from '@/lib/pocketbase/client'

export interface RoomCategoryRecord {
  id: string
  name: string
  unit_count: number
  weight_factor: number
  laundry_cost_per_day: number
  amenities_cost_per_guest: number
  cleaning_cost_per_stay: number
  breakfast_cost_per_person: number
}

export const getRoomCategories = () =>
  pb.collection('room_categories').getFullList<RoomCategoryRecord>()

export const createRoomCategory = (data: Omit<RoomCategoryRecord, 'id'>) =>
  pb.collection('room_categories').create<RoomCategoryRecord>(data)

export const updateRoomCategory = (id: string, data: Partial<RoomCategoryRecord>) =>
  pb.collection('room_categories').update<RoomCategoryRecord>(id, data)

export const deleteRoomCategory = (id: string) => pb.collection('room_categories').delete(id)
