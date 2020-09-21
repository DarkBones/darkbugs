module Cards
  class ShowPresenter < BasePresenter
    attr_reader :card

    def initialize(card)
      @card = card
    end

    def to_h
      {
        card: {
          card_number: card.card_number,
          name: card.name,
          short_name: card.name.truncate(34)
        }
      }
    end
  end
end