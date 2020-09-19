class AddCardCountToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :card_count, :integer, default: 0
    add_column :cards, :card_id, :integer

    add_index :cards, :card_id
  end
end
