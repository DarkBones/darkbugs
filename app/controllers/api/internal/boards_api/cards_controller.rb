module Api
  module Internal
    module BoardsApi
      class CardsController < Api::Internal::BoardsApi::BaseBoardsApiController
        skip_before_action :authenticate!,  only: %i[show]

        before_action :load_card,           only: %i[show destroy update create_board]
        before_action :load_column,         only: %i[create]
        before_action :load_previous_card,  only: %i[create]
        before_action :check_is_member!,    only: %i[create create_board]

        def create
          service = Cards::CreateCardService.new(card_params, @column, @previous_card, @current_user).execute
          @card = service.dig(:results, :card)
        end

        def show
          card_hash = Cards::ShowPresenter.new(@card, @current_user).to_h

          render json: {data: card_hash, status: 200}
        end

        def destroy
          @card.destroy!

          render json: {message: 'success'}
        end

        def update
          @card.update!(card_params)

          render json: {message: 'success'}
        end

        def create_board
          @board = Boards::CreateService.new(@card, params.dig(:board, :name)).execute
        end

        private def load_card
          uuid = params[:uuid] || params[:card_uuid]

          @card = Card.find_by!(uuid: uuid)
        end

        private def card_params
          params.fetch(:card, {}).permit(
              :name
          )
        end

        private def load_column
          @column = Column.find_by!(uuid: params[:column_uuid])
        end

        private def check_is_member!
          return if user_is_member?

          raise ActionController::BadRequest
        rescue ActionController::BadRequest
          render json: 'unauthorized'
        end

        private def owner
          model = @column || @card

          model.board.root_project.owner
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
end
