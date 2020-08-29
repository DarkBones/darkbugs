class Board < ApplicationRecord
  include Slugable

  has_many :columns
  belongs_to :component, polymorphic: true
  belongs_to :root_project, class_name: :Project, foreign_key: :root_project_id

end
