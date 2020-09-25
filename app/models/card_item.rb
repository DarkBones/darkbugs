class CardItem < ApplicationRecord
  include Identifiable
  include Orderable

  belongs_to :card

  before_create :set_position

  private def set_position
    current_position = CardItem.where(card: card).pluck(:position).max || 0

    self.position = current_position + 1
  end
end
