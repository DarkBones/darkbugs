class Board < ApplicationRecord
  include Slugable

  has_many :columns
  has_many :cards, through: :columns
  belongs_to :component, polymorphic: true
  belongs_to :root_project, class_name: :Project, foreign_key: :root_project_id

  def ordered_columns
    columns.order(:position)
  end

end
