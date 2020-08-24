class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.string :name
      t.references :owner, polymorphic: true
      t.string :uuid, blank: false
      t.timestamps
    end

    add_index :projects, :uuid
  end
end
