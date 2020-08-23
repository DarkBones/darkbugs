class AddUniqueIndexes < ActiveRecord::Migration[6.0]
  def change
    add_index :organizations, :name, unique: true
    remove_index :organizations, :slug
    add_index :organizations, :slug, unique: true

    add_index :user_organizations, :confirmation_token, unique: true

    remove_index :user_profiles, :username
    add_index :user_profiles, :username, unique: true

    remove_index :users, :uuid
    add_index :users, :uuid, unique: true
  end
end
