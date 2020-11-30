module Api
  module Internal
    module BoardsApi
      class BoardsController < Api::Internal::BoardsApi::BaseBoardsApiController
        before_action :load_board!,         only: %i[show create reorder_columns reorder_cards update]
        before_action :check_is_assignee!,  only: %i[create update destroy]
        before_action :load_component!,     only: %i[create]

        def show
          data = Boards::BoardPresenter.new(@board, @current_user).to_h

          render json: {data: data, status: 200}
        end

        def create
          @board = Boards::CreateService
                       .new(@component, board_params[:name])
                       .execute
        end

        def reorder_columns
          params[:columns].each_with_index do |uuid, idx|
            column = @board.columns.find_by!(uuid: uuid)
            column.update!(position: idx)
          end

          Cards::SetPositionsService.new(@board).execute

          render json: 'success'
        end

        def reorder_cards
          card =          @board.cards.find_by!(uuid: params[:card_uuid])
          column =        @board.columns.find_by!(uuid: params[:column_uuid])
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

          render :create
        end

        private def board_params
          params.fetch(:board, {}).permit(
              :name
          )
        end

        private def load_component!
          model = params[:component_type].classify.constantize

          if model.name == 'Project'
            @component = model.find_by!(key: params[:component_uuid])
          else
            @component = model.find_by!(uuid: params[:component_uuid])
          end
        end

        private def load_project!
          @project = Project.find_by!(key: params[:project_key])
        end

        private def load_board!
          load_project!

          slug = params[:slug] || params[:board_slug]

          @board = Board.find_by!(slug: slug, root_project_id: @project.id)
        end

        private def check_is_assignee!
          load_project!

          return if @project.user_is_assigned?(@current_user)

          raise ActionController::BadRequest
        rescue ActionController::BadRequest
          render json: 'unauthorized'
        end
      end
    end
  end
end
