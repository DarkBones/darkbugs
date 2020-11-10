class Create<%= class_name.pluralize %> < ActiveRecord::Migration[6.0]
  def change
    create_table :<%= file_name.pluralize %> do |t|

      t.timestamps
    end
  end
end