class CreateCardItems < ActiveRecord::Migration[6.0]
  def change
    create_table :card_items do |t|
      t.string :uuid
      t.references :card
      t.references :author, index: true, foreign_key: { to_table: :users }
      t.integer :position
      t.timestamps
    end

    add_index :card_items, :uuid
  end
end
