module Cards
  class CreateCardService < BaseService
    attr_reader :params, :column, :previous_card, :current_user

    def initialize(params, column, previous_card, current_user)
      @params = params
      @column = column
      @previous_card = previous_card
      @current_user = current_user
    end

    def execute
      card = create_card

      if previous_card.present?
        if previous_card.lower_item.present?
          card.insert_at(previous_card.lower_item.position)
        else
          card.move_to_bottom
        end
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
