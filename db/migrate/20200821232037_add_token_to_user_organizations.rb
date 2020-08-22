class AddTokenToUserOrganizations < ActiveRecord::Migration[6.0]
  def change
    add_column :user_organizations, :confirmation_token, :string
    add_column :user_organizations, :invited_at, :datetime
    add_column :user_organizations, :accepted_at, :datetime
  end
end
