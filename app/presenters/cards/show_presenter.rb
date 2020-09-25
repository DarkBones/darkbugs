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
          short_name: card.name.truncate(34),
          uuid: card.uuid
        }
      }
    end

    private  def card_items
      items = {}

      card.card_items.each do |card_item|
        author = card_item.author

        items[card_item.uuid] = {
          author_avatar: author&.avatar_path,
          author_name: author&.name,
          created_at: card_item.created_at,
          updated_at: card_item.updated_at,
          type: card_item.item_type,
          params: card_item.formatted_item,
          uuid: card_item.uuid
        }
      end

      items
    end
  end
end