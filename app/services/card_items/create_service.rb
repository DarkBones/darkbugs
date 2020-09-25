module CardItems
  class CreateService < BaseService
    attr_reader :item_type, :params, :current_user, :card

    def initialize(item_type, params, current_user, card)
      @item_type = item_type
      @params = params
      @current_user = current_user
      @card = card
    end

    def execute
      item = create_item

      results = {
        item: item
      }

      success({ results: results })
    end

    private def create_item
      klass = item_type.titleize.constantize

      params.permit!

      CardItem.transaction do
        card_item = card.card_items.create!({
                                  card: card,
                                  item_type: item_type,
                                  author_id: current_user.id
                              })

        item = klass.new(params)
        item.card_item_id = card_item.id
        item.save!

        card_item
      end
    end

    private def create_item_old
      klass = item_type.titleize.constantize

      params.permit!
      item = klass.new(params)
      item.card_id = card.id
    end
  end
end