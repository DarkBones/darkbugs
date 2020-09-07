class CreateCards < ActiveRecord::Migration[6.0]
  def change
    create_table :cards do |t|
      t.string :uuid, null: false
      t.string :name
      t.integer :next_id
      t.boolean :first
      t.references :column
      t.integer :reporter_id, index: true
      t.integer :assignee_id, index: true
      t.timestamps
    end

    add_index :cards, :uuid
    add_index :cards, :next_id
    add_index :cards, :first
  end
end
