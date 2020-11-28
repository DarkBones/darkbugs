module Api
  module Internal
    class ColumnsController < Api::Internal::BaseApiInternalController
      before_action :load_column, only: %i[update destroy]
      before_action :load_board!, only: %i[create]
      before_action :check_is_assignee!, only: %i[create update destroy]

      def create
        @column = @board.columns.create!(column_params)
      end

      def update
        @column.update!(column_params)

        render :create
      end

      def destroy
        @uuid = @column.uuid

        @column&.destroy!
      end

      private def load_column
        @column = Column.find_by(uuid: params[:uuid])
      end

      private def load_board!
        @board = Board.find_by!(slug: params[:board_slug])
      end

      private def column_params
        params.fetch(:column, {}).permit(
          :name,
          :position
        )
      end

      private def check_is_assignee!
        board = @column&.board || @board

        return if board.user_is_assigned?(@current_user)

        raise ActionController::BadRequest
      rescue ActionController::BadRequest
        render json: 'unauthorized'
      end
    end
  end
end
