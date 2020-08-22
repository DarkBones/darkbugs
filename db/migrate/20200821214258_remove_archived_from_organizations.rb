class RemoveArchivedFromOrganizations < ActiveRecord::Migration[6.0]
  def change
    remove_column :organizations, :archived
  end
end
