module Api
  module Internal
    class CardsController < Api::Internal::BaseApiInternalController
      before_action :load_column, only: %i[create]
      before_action :load_above_card, only: %i[create]
      before_action :check_is_member!, only: %i[create]

      def create
        service = Cards::CreateCardService.new(card_params, @column, @above_card, @current_user).execute
        @card = service.dig(:results, :card)
      end

      private def card_params
        params.fetch(:card, {}).permit(
          :name
        )
      end

      private def load_column
        @column = Column.find_by!(uuid: params[:column_uuid])
      end

      private def load_above_card
        @above_card = @column.cards.find_by(uuid: params[:above_card])
      end

      private def check_is_member!
        return if user_is_member?

        raise ActionController::BadRequest
      rescue ActionController::BadRequest
        render json: 'unauthorized'
      end

      private def owner
        @column.board.root_project.owner
      end

      private def user_is_member?
        return true if owner == @current_user

        return false if owner.class == User

        return owner.user_is_member?(@current_user) if owner.class == Organization

        false
      end
    end
  end
end
