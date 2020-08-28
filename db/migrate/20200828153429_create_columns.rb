class CreateColumns < ActiveRecord::Migration[6.0]
  def change
    create_table :columns do |t|
      t.string :name
      t.references :board
      t.integer :position, default: 0, null: false
      t.timestamps
    end
  end
end
