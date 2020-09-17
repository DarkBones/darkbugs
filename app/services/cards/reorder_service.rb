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

      if previous_card.nil?
        card.move_to_top
        return success
      end

      if card.position < previous_card.position
        card.insert_at(previous_card.position)
        return success
      end

      if previous_card.lower_item.nil?
        card.move_to_bottom
        return success
      end

      card.insert_at(previous_card.lower_item.position)
      success
    end

    private def update_card
      card.update!(
        column: column
      )
    end
  end
end
