class CreateTenants < ActiveRecord::Migration[6.0]
  def change
    create_table :tenants do |t|
      t.references :model, polymorphic: true
      t.string :key
      t.timestamps
    end
  end
end
