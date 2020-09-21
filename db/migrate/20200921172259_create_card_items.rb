class CreateCardItems < ActiveRecord::Migration[6.0]
  def change
    create_table :card_items do |t|
      t.references :card
      t.references :item, polymorphic: true
      t.integer :position
      t.timestamps
    end
  end
end
