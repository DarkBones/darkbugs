module CardItems
  class CardItemPresenter < BasePresenter
    attr_reader :card_item

    def initialize(card_item)
      @card_item = card_item
    end

    def to_h
      author = card_item.author

      {
        author_avatar:  author&.avatar_path,
        author_id:      author&.uuid,
        author_name:    author&.name,
        created_at:     card_item.created_at,
        updated_at:     card_item.updated_at,
        type:           card_item.item_type,
        params:         card_item.formatted_item,
        uuid:           card_item.uuid
      }
    end
  end
end