class CreateCardItems < ActiveRecord::Migration[6.0]
  def change
    create_table :card_items do |t|
      t.string :uuid
      t.string :item_type
      t.references :card
      t.bigint :author_id
      t.integer :position
      t.timestamps
    end

    add_index :card_items, :uuid
    add_index :card_items, :author_id
  end
end
