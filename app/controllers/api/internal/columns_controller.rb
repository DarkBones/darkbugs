module Api
  module Internal
    class ColumnsController < Api::Internal::BaseApiInternalController
      before_action :load_column, only: %i[update]

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
    end
  end
end
