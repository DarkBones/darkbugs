module Api
  module Internal
    class ColumnsController < Api::Internal::BaseApiInternalController
      before_action :load_column, only: %i[update]
      before_action :check_is_admin!, only: %i[update]

      def update
        @column.update!(column_params)
      end

      private def load_column
        @column = Column.find_by!(uuid: params[:uuid])
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

      private def owner_is_admin?
        owner = @column.board.root_project.owner
        return true if owner == @current_user

        return false if owner.class == User

        return owner.user_is_admin?(@current_user) if owner.class == Organization

        false
      end
    end
  end
end
