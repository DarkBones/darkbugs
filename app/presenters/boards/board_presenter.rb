module Boards
  class BoardPresenter < BasePresenter
    attr_reader :board

    def initialize(board)
      @board = board
    end

    def to_h
      {
        name: board.name,
        columns: columns
      }
    end

    private def columns
      board.columns.order(:position).map do |column|
        {
          uuid: column.uuid,
          name: column.name
        }
      end
    end
  end
end
