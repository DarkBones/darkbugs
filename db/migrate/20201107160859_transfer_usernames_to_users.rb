class TransferUsernamesToUsers < ActiveRecord::Migration[6.0]
  def self.up
    add_column :users, :username, :string
    execute 'UPDATE users u SET username = p.username FROM user_profiles p WHERE u.id = p.user_id;'
    remove_column :user_profiles, :username

    add_index :users, :username, unique: true
    change_column_null :users, :username, false
  end

  def self.down
    add_column :user_profiles, :username, :string
    execute 'UPDATE user_profiles p SET username = u.username FROM users u WHERE p.user_id = u.id'
    remove_column :users, :username

    add_index :user_profiles, :username, unique: true
    change_column_null :user_profiles, :username, false
  end
end
