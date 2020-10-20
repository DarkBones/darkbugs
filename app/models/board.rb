class Board < ApplicationRecord
  include Slugable
  include Assignable

  has_many :columns
  has_many :cards, -> { order(position: :asc) }
  belongs_to :component, polymorphic: true
  belongs_to :root_project, class_name: :Project, foreign_key: :root_project_id

  accepts_nested_attributes_for :columns

  validates_presence_of :name

  def user_is_assigned?(user)
    component.user_is_assigned?(user)
  end

end
