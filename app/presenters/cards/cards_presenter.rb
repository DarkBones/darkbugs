module Cards
  class CardsPresenter < BasePresenter
    attr_reader :board

    def initialize(board)
      @board = board
    end

    def to_h
      cards = {}
      board.cards.order(:position).map.with_index do |card, idx|
        cards[card.uuid.to_sym] = format_card(card, idx)
      end

      cards.to_h
    end

    def format_card(card, idx)
      {
        uuid: card.uuid,
        name: card.name,
        position: card.position,
        index: idx
      }
    end
  end
end
