migrate(
  (app) => {
    const collection = new Collection({
      name: 'room_categories',
      type: 'base',
      listRule: "@request.auth.id != '' && user_id = @request.auth.id",
      viewRule: "@request.auth.id != '' && user_id = @request.auth.id",
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != '' && user_id = @request.auth.id",
      deleteRule: "@request.auth.id != '' && user_id = @request.auth.id",
      fields: [
        {
          name: 'user_id',
          type: 'relation',
          required: true,
          collectionId: '_pb_users_auth_',
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: 'name', type: 'text', required: true },
        { name: 'unit_count', type: 'number', required: true, min: 1, onlyInt: true },
        { name: 'weight_factor', type: 'number', required: true, min: 0.1 },
        { name: 'laundry_cost_per_day', type: 'number', required: false, min: 0 },
        { name: 'amenities_cost_per_guest', type: 'number', required: false, min: 0 },
        { name: 'cleaning_cost_per_stay', type: 'number', required: false, min: 0 },
        { name: 'breakfast_cost_per_person', type: 'number', required: false, min: 0 },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
      indexes: ['CREATE INDEX idx_room_categories_user ON room_categories (user_id)'],
    })
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('room_categories')
    app.delete(collection)
  },
)
