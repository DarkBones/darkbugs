class CreateOrganizations < ActiveRecord::Migration[6.0]
  def change
    create_table :organizations do |t|
      t.string :name
      t.string :slug, unique: true
      t.timestamps
    end

    add_index :organizations, :slug
  end
end
