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
      # Setting this at 100,000 and working backwards avoids
      # having to update all card positions every time a new
      # one is created (this assumes old cards don't get moved much)
      position = 100_000

      board.ordered_columns.reverse.each do |col|
        col.cards.order(:position, :created_at).reverse.each do |c|
          c.update!(position: position) if c.position != position

          position -= 1
        end
      end
    end
  end
end
