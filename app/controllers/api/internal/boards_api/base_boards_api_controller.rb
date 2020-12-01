module Api
  module Internal
    module BoardsApi
      class BaseBoardsApiController < Api::Internal::BaseApiInternalController
        private def load_column
          uuid = params[:column_uuid] || params[:uuid]
          @column ||= Column.find_by(uuid: uuid)
        end

        private def load_previous_card
          load_column

          column_index = params[:column_index].to_i - 1
          column_cards = @column.cards.ordered

          if column_index < 0 || @column.cards.count == 0
            column = @column.previous_populated_column

            if @card.present?
              @previous_card = column.cards.ordered.where.not(uuid: @card.uuid).last unless column.nil?
            else
              @previous_card = column.cards.ordered.last unless column.nil?
            end
            return
          end

          column_index = [column_index, @column.cards.count - 1].min
          @previous_card = column_cards.offset(column_index).first
        end
      end
    end
  end
end