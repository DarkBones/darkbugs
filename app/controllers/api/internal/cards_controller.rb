module Api
  module Internal
    class CardsController < Api::Internal::BaseApiInternalController
      before_action :load_column, only: %i[create]

      def create
        @card = @column.cards.create!(card_params)

        render json: @column_hash = Columns::ColumnPresenter.new(@column).to_h
      end

      private def card_params
        params.fetch(:card, {}).permit(
          :name
        )
      end

      private def load_column
        @column = Column.find_by!(uuid: params[:column_uuid])
      end
    end
  end
end
