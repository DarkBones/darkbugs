class CreateCards < ActiveRecord::Migration[6.0]
  def change
    create_table :cards do |t|
      t.string :name
      t.references :reporter, index: true, foreign_key: { to_table: :users }
      t.references :assignee, index: true, foreign_key: { to_table: :users }
      t.timestamps
    end
  end
end
