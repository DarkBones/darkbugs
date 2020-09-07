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
      puts above_card&.name
      puts above_card&.name
      puts above_card&.name
      puts above_card&.name
      puts above_card&.name
      puts above_card&.name
      card = create_card
      card.append_to(above_card) if above_card.present?

      results = {
        card: card
      }

      success({ results: results })
    end

    private def create_card
      puts card_attributes
      column.cards.create!(
        card_attributes
      )
    end

    private def card_attributes
      {
        name: params[:name],
        reporter_id: current_user.id
      }
    end
  end
end
