module Cards
  class CreateCardService < BaseService
    attr_reader :params, :column, :above_card, :current_user

    def initialize(params, column, above_card, current_user)
      @params = params
      @column = column
      @above_card = above_card
      @current_user = current_user
    end

    def execute
      card = create_card

      Cards::SetPositionsService.new(column.board).execute

      results = {
        card: card
      }

      success({ results: results })
    end

    private def create_card
      column.cards.create!(
        card_attributes
      )
    end

    private def new_position
      return above_card.position if above_card.present?

      column.cards.pluck(:position).max || 0
    end

    private def card_attributes
      {
        name: params[:name],
        position: new_position,
        reporter: current_user
      }
    end
  end
end
