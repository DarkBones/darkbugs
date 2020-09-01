module Boards
  class BoardPresenter < BasePresenter
    attr_reader :board, :current_user

    def initialize(board, current_user)
      @board = board
      @current_user = current_user
    end

    def to_h
      {
        name: board.name,
        board_slug: board.slug,
        cards: cards,
        columns: {
          columns: columns,
          order: board.ordered_columns.pluck(:uuid)
        },
        user_is_admin: user_is_admin?
      }
    end

    private def user_is_admin?
      owner = board.root_project.owner
      return true if owner == current_user

      return false if owner.class == User

      return owner.user_is_admin?(current_user) if owner.class == Organization

      false
    end

    private def cards
      Cards::CardsPresenter.new(board).to_h
    end

    private def columns
      cols = {}
      board.ordered_columns.map do |column|
        cols[column.uuid.to_sym] = Columns::ColumnPresenter.new(column).to_h
      end
      cols.to_h
    end
  end
end
