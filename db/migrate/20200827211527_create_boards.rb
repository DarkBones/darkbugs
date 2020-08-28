class CreateBoards < ActiveRecord::Migration[6.0]
  def change
    create_table :boards do |t|
      t.references :component, polymorphic: true
      t.string :name
      t.string :slug
      t.timestamps
    end
  end
end
