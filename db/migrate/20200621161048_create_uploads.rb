class CreateUploads < ActiveRecord::Migration[6.0]
  def change
    create_table :uploads do |t|
      t.string  :owner_table
      t.integer :owner_id
      t.string  :owner_field
      t.string  :path
      t.timestamps
    end
  end
end
