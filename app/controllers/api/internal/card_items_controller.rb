module Api
  module Internal
    class CardItemsController < Api::Internal::BaseApiInternalController
      before_action :load_card, only: %i[create]
      before_action :check_is_assignee!, only: %i[create]

      def create
        result = CardItems::CreateService.new(params[:type], item_params, @current_user, @card).execute

        # TODO: Strip ID
        render json: result
      end

      private def item_params
        params.fetch(:item, {}).permit(
            :content
        )
      end

      private def load_card
        @card = Card.find_by!(uuid: params[:card_uuid])
      end

      private def check_is_assignee!
        board = @card.column.board

        return if board.user_is_assigned?(@current_user)

        raise ActionController::BadRequest
      rescue ActionController::BadRequest
        render json: 'unauthorized'
      end
    end
  end
end