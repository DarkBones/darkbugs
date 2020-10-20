class CardItem < ApplicationRecord
  include Identifiable
  include Orderable

  belongs_to :card
  has_one :note

  accepts_nested_attributes_for :note

  before_create :set_position

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

  private def set_position
    current_position = CardItem.where(card: card).pluck(:position).max || 0

    self.position = current_position + 1
  end
end
