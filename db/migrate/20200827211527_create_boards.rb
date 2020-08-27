class CreateBoards < ActiveRecord::Migration[6.0]
  def change
    create_table :boards do |t|
      t.references :project
      t.string :name
      t.string :slug
      t.string :props
      t.timestamps
    end
  end
end
