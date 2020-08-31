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
        card_uuids: column.cards.order(:position).pluck(:uuid)
      }
    end
  end
end
