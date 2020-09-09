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

      if above_card.present?
        card.insert_at(above_card.lower_item.position) if above_card.lower_item.present?
      else
        card.move_to_top
      end

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

    private def card_attributes
      {
        name: params[:name],
        reporter_id: current_user.id,
        board: column.board
      }
    end
  end
end
