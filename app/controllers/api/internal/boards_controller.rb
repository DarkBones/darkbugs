module Api
  module Internal
    class BoardsController < Api::Internal::BaseApiInternalController
      before_action :load_board, only: %i[reorder_columns]
      before_action :check_is_assignee!, only: %i[create update destroy]

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

      private def check_is_assignee!
        return if @board.user_is_assigned?(@current_user)

        raise ActionController::BadRequest
      rescue ActionController::BadRequest
        render json: 'unauthorized'
      end
    end
  end
end