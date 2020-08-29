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
        columns: columns,
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
