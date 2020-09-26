module CardItems
  class CardItemPresenter < BasePresenter
    attr_reader :card_item, :current_user

    def initialize(card_item, current_user)
      @card_item = card_item
      @current_user = current_user
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
        user_is_author: current_user.uuid == author.uuid,
        uuid:           card_item.uuid
      }
    end
  end
end