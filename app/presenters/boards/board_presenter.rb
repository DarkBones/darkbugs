module Boards
  class BoardPresenter < BasePresenter
    attr_reader :board, :current_user

    def initialize(board, current_user)
      @board = board
      @current_user = current_user
    end

    def to_h
      {
          boards: boards,
          name: board.name,
          board_slug: board.slug,
          cards: cards,
          card_order: board.cards.ordered.pluck(:uuid),
          columns: columns,
          column_order: board.columns.ordered.pluck(:uuid),
          user_is_assigned: board.user_is_assigned?(current_user)
      }
    end

    private def boards
      boards = {}
      board.siblings.each do |board|
        boards[board.slug] = board.name
      end

      boards
    end

    private def cards
      Cards::CardsPresenter.new(board).to_h
    end

    private def columns
      cols = {}
      board.columns.ordered.map do |column|
        cols[column.uuid.to_sym] = Columns::ColumnPresenter.new(column).to_h
      end
      cols.to_h
    end
  end
end
