module Boards
  class BoardPresenter < BasePresenter
    attr_reader :board

    def initialize(board)
      @board = board
    end

    def to_h
      {
        title: board.name,
        columns: columns
      }
    end

    private def columns
      board.columns.order(:position).map do |column|
        {
          title: column.name
        }
      end
    end
  end
end
