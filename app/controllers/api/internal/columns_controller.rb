module Api
  module Internal
    class ColumnsController < Api::Internal::BaseApiInternalController
      before_action :load_column, only: %i[update destroy]
      before_action :load_board, only: %i[create]
      before_action :check_is_admin!, only: %i[create update destroy]

      def create
        @column = @board.columns.create!(column_params)
      end

      def update
        @column.update!(column_params)

        render :create
      end

      def destroy
        @uuid = @column.uuid

        @column.destroy!
      end

      private def load_column
        @column = Column.find_by!(uuid: params[:uuid])
      end

      private def load_board
        @board = Board.find_by!(slug: params[:board_slug])
      end

      private def column_params
        params.fetch(:column, {}).permit(
          :name,
          :position
        )
      end

      private def check_is_admin!
        return if owner_is_admin?

        raise ActionController::BadRequest
      rescue ActionController::BadRequest
        render json: 'unauthorized'
      end

      private def owner
        if defined?(@column)
          @column.board.root_project.owner
        else
          @board.root_project.owner
        end
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
