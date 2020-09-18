class CreateBoards < ActiveRecord::Migration[6.0]
  def change
    create_table :boards do |t|
      t.references :component, polymorphic: true
      t.references :root_project, index: true, foreign_key: { to_table: :projects }
      t.string :name
      t.string :slug
      t.timestamps
    end
  end
end
