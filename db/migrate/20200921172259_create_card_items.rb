class CreateCardItems < ActiveRecord::Migration[6.0]
  def change
    create_table :card_items do |t|
      t.string :uuid
      t.references :card
      t.references :item, polymorphic: true
      t.integer :position
      t.timestamps
    end

    add_index :card_items, :uuid
  end
end
