module Cards
  class ReorderService < BaseService
    attr_reader :board, :column, :card, :above_card

    def initialize(board:, column:, card:, above_card:)
      @board = board
      @column = column
      @card = card
      @above_card = above_card
    end

    def execute
      update_card

      if above_card.present?
        if above_card.lower_item.present?
          card.insert_at(above_card.position)
        else
          card.move_to_bottom
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
