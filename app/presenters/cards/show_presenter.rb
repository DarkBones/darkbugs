module Cards
  class ShowPresenter < BasePresenter
    include Rails.application.routes.url_helpers

    attr_reader :card, :current_user

    def initialize(card, current_user)
      @card = card
      @current_user = current_user
    end

    def to_h
      {
        card: {
          board_order: board_order,
          boards: boards,
          item_order: card.card_items.ordered.pluck(:uuid),
          items: card_items,
          name: card.name,
          number: card.card_number,
          uuid: card.uuid
        }
      }
    end

    private def board_order
      card.boards.order(:created_at).pluck(:slug)
    end

    private def boards
      boards = {}
      card.boards.each do |board|
        boards[board.slug] = {
            name: board.name,
            path: project_board_path(project_key: board.root_project.key, slug: board.slug)
        }
      end

      boards
    end

    private  def card_items
      items = {}

      card.card_items.each do |card_item|
        item_presenter = CardItems::CardItemPresenter.new(card_item, current_user)

        items[card_item.uuid] = item_presenter.to_h
      end

      items
    end
  end
end