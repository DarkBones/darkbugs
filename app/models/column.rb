class Column < ApplicationRecord
  include Identifiable
  include Orderable

  belongs_to :board
  has_many :cards, -> { order(position: :asc) }, dependent: :destroy

  validates :name, presence: true
  validates :position, presence: true, on: :create

  before_create :set_position

  def previous_column
    board.columns.where('position < ?', position).order(:position).last
  end

  def previous_populated_column
    pc = previous_column
    while pc.present? && pc.cards.count == 0
      pc = previous_column
    end

    pc
  end

  private def set_position
    max_position = board.columns.pluck(:position).max
    self.position = max_position.nil? ? 0 : max_position + 1
  end
end
