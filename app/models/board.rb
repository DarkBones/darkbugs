class Board < ApplicationRecord
  include Slugable
  include Assignable

  # -- Constants ------------------------------------------------------------.
  DEFAULT_COLUMNS = %w[
    open
    in_progress
    done
    released
    archived
  ]

  # -- Relationships --------------------------------------------------------
  has_many :columns, dependent: :destroy
  has_many :cards, -> { order(position: :asc) }, dependent: :destroy
  belongs_to :component, polymorphic: true
  belongs_to :root_project, class_name: :Project, foreign_key: :root_project_id

  # -- Validations ----------------------------------------------------------
  validates_presence_of :name

  # -- Instance Methods -----------------------------------------------------
  def user_is_assigned?(user)
    component.user_is_assigned?(user)
  end
end
