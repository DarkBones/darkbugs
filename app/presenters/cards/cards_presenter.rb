module Cards
  class CardsPresenter < BasePresenter
    attr_reader :board

    def initialize(board)
      @board = board
    end

    def to_h
      cards = {}
      board.cards.order(:position).map do |card|
        cards[card.uuid.to_sym] = format_card(card)
      end

      cards.to_h
    end

    def format_card(card)
      {
        uuid: card.uuid,
        name: card.name,
        position: card.position
      }
    end
  end
end
