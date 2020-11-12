module Cards
  class ShowPresenter < BasePresenter
    attr_reader :card, :current_user

    def initialize(card, current_user)
      @card = card
      @current_user = current_user
    end

    def to_h
      {
        card: {
          item_order: card.card_items.ordered.pluck(:uuid),
          items: card_items,
          name: card.name,
          number: card.card_number,
          uuid: card.uuid
        }
      }
    end

    private  def card_items
      items = {}

      card.card_items.each do |card_item|
        item_presenter = CardItems::CardItemPresenter.new(card_item, current_user)

        items[card_item.uuid] = item_presenter.to_h
      end

      items
    end
  end
end