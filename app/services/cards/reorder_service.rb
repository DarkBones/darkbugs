module Cards
  class ReorderService < BaseService
    attr_reader :board, :column, :card, :card_index

    def initialize(board:, column:, card:, card_index:)
      @board = board
      @column = column
      @card = card
      @card_index = get_true_card_index(card_index)

      puts @card_index
      puts @card_index
      puts @card_index
      puts @card_index
    end

    def execute
      update_card

      update_below_cards

      success
    end

    private def update_below_cards
      return if below_cards.first.nil?

      position = below_cards.first.position
      below_cards.each do |c|
        position += 1
        c.update!(position: position)
      end
    end

    private def below_cards
      board
        .cards
        .where.not(uuid: card.uuid)
        .where('cards.position > ?', card_index)
    end

    private def update_card
      card.update!(
        column: column,
        position: card_position
      )
    end

    private def card_position
      current_card_at_position = column.cards.order(:position).offset(card_index).take
      if current_card_at_position.present?
        return current_card_at_position.position
      end

      previous_column = column.previous_populated_column

      return 0 if previous_column.nil? || previous_column.cards.count == 0

      previous_column.cards.order(:position).last.position
    end

    private def get_true_card_index(index)
      return index if index > 0

      previous_column = column.previous_populated_column

      return 0 if previous_column.nil?

      previous_column.cards.order(:position).last.position
    end
  end
end
