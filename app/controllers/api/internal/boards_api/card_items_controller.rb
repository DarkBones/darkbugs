module Api
  module Internal
    module BoardsApi
      class CardItemsController < Api::Internal::BoardsApi::BaseBoardsApiController
        before_action :load_card!,          only: %i[create]
        before_action :load_card_item!,     only: %i[destroy update]
        before_action :check_is_assignee!,  only: %i[create]
        before_action :check_is_author!,    only: %i[destroy update]

        def create
          service = CardItems::CreateService.new(params[:type], item_params, @current_user, @card).execute

          card_item = service.dig(:results, :item)

          render json: CardItems::CardItemPresenter.new(card_item, @current_user).to_h
        end

        def update
          @card_item.item.update!(item_params)

          render json: CardItems::CardItemPresenter.new(@card_item, @current_user).to_h
        end

        def destroy
          @card_item.destroy!

          render json: {}
        end

        private def load_card_item!
          @card_item ||= CardItem.find_by!(uuid: params[:uuid])
        end

        private def item_params
          params.fetch(:item, {}).permit(
              :content
          )
        end

        private def load_card!
          @card ||= Card.find_by!(uuid: params[:card_uuid])
        end

        private def check_is_author!
          load_card_item!

          return if @card_item.author == @current_user

          raise ActionController::BadRequest
        rescue ActionController::BadRequest
          render json: 'unauthorized'
        end

        private def check_is_assignee!
          load_card!

          board = @card.column.board

          return if board.user_is_assigned?(@current_user)

          raise ActionController::BadRequest
        rescue ActionController::BadRequest
          render json: 'unauthorized'
        end
      end
    end
  end
end