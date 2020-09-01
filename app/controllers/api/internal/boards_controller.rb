module Api
  module Internal
    class BoardsController < Api::Internal::BaseApiInternalController
      before_action :load_board, only: %i[reorder_columns]
      before_action :check_is_admin!, only: %i[create update destroy]

      def reorder_columns
        params[:columns].each_with_index do |uuid, idx|
          column = @board.columns.find_by!(uuid: uuid)
          column.update!(position: idx)
        end

        render json: 'success'
      end

      private def load_board
        @board = Board.find_by!(slug: params[:board_slug])
      end

      private def check_is_admin!
        return if owner_is_admin?

        raise ActionController::BadRequest
      rescue ActionController::BadRequest
        render json: 'unauthorized'
      end

      private def owner
        @board.root_project.owner
      end

      private def owner_is_admin?
        return true if owner == @current_user

        return false if owner.class == User

        return owner.user_is_admin?(@current_user) if owner.class == Organization

        false
      end
    end
  end
end
