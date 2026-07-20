migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('room_categories')

    let userId = ''
    try {
      const user = app.findAuthRecordByEmail('_pb_users_auth_', 'liamadeiracampos@gmail.com')
      userId = user.id
    } catch (_) {
      return
    }

    const seeds = [
      {
        name: 'Standard',
        unit_count: 8,
        weight_factor: 1.0,
        laundry_cost_per_day: 8.5,
        amenities_cost_per_guest: 4,
        cleaning_cost_per_stay: 15,
        breakfast_cost_per_person: 18,
      },
      {
        name: 'Luxo',
        unit_count: 5,
        weight_factor: 1.5,
        laundry_cost_per_day: 12,
        amenities_cost_per_guest: 8,
        cleaning_cost_per_stay: 20,
        breakfast_cost_per_person: 22,
      },
      {
        name: 'Suíte',
        unit_count: 2,
        weight_factor: 2.0,
        laundry_cost_per_day: 18,
        amenities_cost_per_guest: 15,
        cleaning_cost_per_stay: 30,
        breakfast_cost_per_person: 28,
      },
    ]

    for (const s of seeds) {
      try {
        app.findFirstRecordByData('room_categories', 'name', s.name)
      } catch (_) {
        const record = new Record(col)
        record.set('user_id', userId)
        record.set('name', s.name)
        record.set('unit_count', s.unit_count)
        record.set('weight_factor', s.weight_factor)
        record.set('laundry_cost_per_day', s.laundry_cost_per_day)
        record.set('amenities_cost_per_guest', s.amenities_cost_per_guest)
        record.set('cleaning_cost_per_stay', s.cleaning_cost_per_stay)
        record.set('breakfast_cost_per_person', s.breakfast_cost_per_person)
        app.save(record)
      }
    }
  },
  (app) => {
    const records = app.findRecordsByFilter('room_categories', '1=1', '', 100, 0)
    for (const r of records) {
      app.delete(r)
    }
  },
)
