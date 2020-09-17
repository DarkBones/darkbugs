module Cards
  class ReorderService < BaseService
    attr_reader :board, :column, :card, :previous_card

    def initialize(board:, column:, card:, previous_card:)
      @board = board
      @column = column
      @card = card
      @previous_card = previous_card
    end

    def execute
      update_card
      
      if previous_card.present?
        if card.position < previous_card.position
          card.insert_at(previous_card.position)
        else
          if previous_card.lower_item.present?
            card.insert_at(previous_card.lower_item.position)
          else
            card.move_to_bottom
          end
        end
      else
        card.move_to_top
      end

      success
    end

    private def update_card
      card.update!(
        column: column
      )
    end
  end
end
