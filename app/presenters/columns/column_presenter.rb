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
        position: column.position,
        card_uuids: column.cards.ordered.pluck(:uuid)
      }
    end
  end
end
