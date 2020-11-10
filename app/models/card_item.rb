class CardItem < ApplicationRecord
  include Identifiable
  include Orderable

  # -- Constants ------------------------------------------------------------
  ITEM_TYPES = %w[
    note
  ]

  # -- Relationships --------------------------------------------------------
  belongs_to :card

  # -- Callbacks ------------------------------------------------------------
  before_create :set_position

  # -- Instance Methods -----------------------------------------------------
  def formatted_item
    "CardItems::#{item_type.titleize.pluralize}::#{item_type.titleize}Presenter"
        .constantize
        .new(item)
        .to_h
  end

  def item
    item_type.titleize.constantize.find_by!(card_item_id: id)
  end

  def author
    User.find_by(id: author_id)
  end

  # -- Private Methods ------------------------------------------------------
  private def set_position
    current_position = CardItem.where(card: card).pluck(:position).max || 0

    self.position = current_position + 1
  end
end
