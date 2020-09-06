module Api
  module Internal
    class BoardsController < Api::Internal::BaseApiInternalController
      before_action :load_board, only: %i[reorder_columns reorder_cards]
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
        # card = @board.cards.find_by!(uuid: params[:card_uuid])
        # column = @board.columns.find_by!(uuid: params[:columns][:destination])
        #
        # card_index = column.cards.order(:position)[params[:card_index]].position
        # card.update!(
        #   column_id: column.id,
        #   position: card_index + 1
        # )
        #
        # cards_below = column.cards.where.not(uuid: card.uuid).order(:position).offset(params[:card_index])
        # position = cards_below.first&.position + 1
        # cards_below.each do |c|
        #   position += 1
        #   c.update!(position: position)
        # end

        card = @board.cards.find_by!(uuid: params[:card_uuid])
        column = @board.columns.find_by!(uuid: params[:column])
        card_index = params[:card_index]

        Cards::ReorderService.new(
          board: @board,
          column: column,
          card: card,
          card_index: card_index)
          .execute

        render json: Cards::CardsPresenter.new(@board).to_h
      end

      private def load_board
        @board = Board.find_by!(slug: params[:board_slug])
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
