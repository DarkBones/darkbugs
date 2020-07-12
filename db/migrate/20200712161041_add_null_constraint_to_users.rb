class AddNullConstraintToUsers < ActiveRecord::Migration[6.0]
  def change
    change_column_null :users, :uuid, false
  end
end
