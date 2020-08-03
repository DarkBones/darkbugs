class AddArchivedToOrganizations < ActiveRecord::Migration[6.0]
  def change
    add_column :organizations, :archived, :boolean, default: false
  end
end
