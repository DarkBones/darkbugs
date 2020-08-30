class Column < ApplicationRecord
  include Identifiable

  belongs_to :board
  has_many :cards, dependent: :destroy

  validates :name, presence: true
  validates :position, presence: true, on: :create

  before_create :set_position

  private def set_position
    max_position = board.columns.pluck(:position).max
    self.position = max_position.nil? ? 0 : max_position + 1
  end
end
