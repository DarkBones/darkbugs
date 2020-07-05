class CreateUserOrganizations < ActiveRecord::Migration[6.0]
  def change
    create_table :user_organizations do |t|
      t.references :user
      t.references :organization
      t.timestamps
    end
  end
end
