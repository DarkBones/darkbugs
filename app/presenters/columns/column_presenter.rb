module Columns
  class ColumnPresenter < BasePresenter
    attr_reader :column

    def initialize(column)
      @column = column
    end

    def to_h
      {
        uuid: column.uuid,
        name: column.name,
        cards: cards
      }
    end

    private def cards
      column.cards.map do |card|
        {
          uuid: card.uuid,
          name: card.name
        }
      end
    end
  end
end
