module Cards
  class SetPositionsService < BaseService
    attr_reader :board

    def initialize(board)
      @board = board
    end

    def execute
      set_positions

      success
    end

    private def set_positions
      idx = 1
      board.columns.ordered.each do |column|
        column.cards.ordered.each do |card|
          card.update!(position: idx) if card.position != idx
          idx += 1
        end
      end
    end
  end
end
