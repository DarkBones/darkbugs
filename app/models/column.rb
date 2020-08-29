class Column < ApplicationRecord
  include Identifiable

  belongs_to :board

  validates :name, presence: true
  validates :position, presence: true, on: :create

  before_create :set_position

  private def set_position
    self.position = board.columns.count
  end
end
