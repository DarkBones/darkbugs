module Cards
  class ShowPresenter < BasePresenter
    attr_reader :card

    def initialize(card)
      @card = card
    end

    def to_h
      {
        id: card.card_number
      }
    end
  end
end