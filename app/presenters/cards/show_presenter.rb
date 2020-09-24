module Cards
  class ShowPresenter < BasePresenter
    attr_reader :card

    def initialize(card)
      @card = card
    end

    def to_h
      {
        card: {
          item_order: [],
          items: {},
          name: card.name,
          number: card.card_number,
          short_name: card.name.truncate(34),
          uuid: card.uuid
        }
      }
    end
  end
end