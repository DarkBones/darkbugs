module Api
  module Internal
    class BoardsController < Api::Internal::BaseApiInternalController
      before_action :load_board, only: %i[reorder_columns reorder_cards update]
      before_action :check_is_assignee!, only: %i[create update destroy]

      def reorder_columns
        params[:columns].each_with_index do |uuid, idx|
          column = @board.columns.find_by!(uuid: uuid)
          column.update!(position: idx)
        end

        Cards::SetPositionsService.new(@board).execute

        render json: 'success'
      end

      def reorder_cards
        card = @board.cards.find_by!(uuid: params[:card_uuid])
        column = @board.columns.find_by!(uuid: params[:column_uuid])
        previous_card = @board.cards.find_by(uuid: params[:previous_card])

        Cards::ReorderService.new(
          board: @board,
          column: column,
          card: card,
          previous_card: previous_card
        ).execute

        render json: 'success'
      end

      def update
        @board.update!(board_params)

        render json: 'success'
      end

      private def board_params
        params.fetch(:board, {}).permit(
            :name
        )
      end

      private def load_board
        slug = params[:slug] || params[:board_slug]

        @board = Board.find_by!(slug: slug)
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
