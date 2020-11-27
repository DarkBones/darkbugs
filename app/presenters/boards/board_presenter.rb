module Boards
  class BoardPresenter < BasePresenter
    include Rails.application.routes.url_helpers

    attr_reader :board, :current_user

    def initialize(board, current_user)
      @board = board
      @current_user = current_user
    end

    def to_h
      {
          component:        component,
          board_order:      board_order,
          boards:           boards,
          name:             board.name,
          board_slug:       board.slug,
          cards:            cards,
          card_order:       board.cards.ordered.pluck(:uuid),
          columns:          columns,
          column_order:     board.columns.ordered.pluck(:uuid),
          project_key:      board.root_project.key,
          user_is_assigned: board.user_is_assigned?(current_user)
      }
    end

    private def board_order
      board.siblings.order(:created_at).pluck(:slug)
    end

    private def component
      if board.component.is_a? Project
        uuid = board.component.key
      else
        uuid = board.component.uuid
      end

      {
          type: board.component_type,
          uuid: uuid
      }
    end

    private def boards
      boards = {}
      board.siblings.each do |board|
        boards[board.slug] = {
            name: board.name,
            path: project_board_path(project_key: board.root_project.key, slug: board.slug)
        }
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
