module Projects
  class CreateDemoProjectService < BaseService
    attr_reader :user, :original_project

    ORIGINAL_SCHEMA = 'bas'.freeze
    ORIGINAL_PROJECT = 'DRK'.freeze

    PROJECT_ATTRIBUTES = %w[
      name
      key
      created_at
      updated_at
      card_count
    ].freeze

    BOARD_ATTRIBUTES = %w[
      name
      slug
      created_at
      updated_at
    ].freeze

    COLUMN_ATTRIBUTES = %w[
      name
      position
      created_at
      updated_at
    ].freeze

    CARD_ATTRIBUTES = %w[
      name
      position
      created_at
      updated_at
    ].freeze

    CARD_ITEM_ATTRIBUTES = %w[
      item_type
      position
      created_at
      updated_at
    ].freeze

    CARD_ITEM_DETAILS_ATTRIBUTES = %w[
      content
    ]

    def initialize(user)
      @user = user

      Apartment::Tenant.switch!(ORIGINAL_SCHEMA)
      @original_project = Project.find_by!(key: ORIGINAL_PROJECT)
    end

    def execute
      Apartment::Tenant.switch!(ORIGINAL_SCHEMA)

      project_attributes = original_project.attributes.keep_if { |k, _| PROJECT_ATTRIBUTES.include? k }
                               .merge(owner: user)

      Apartment::Tenant.switch!(user.tenant_key)

      project = Project.create!(project_attributes)

      Apartment::Tenant.switch!(ORIGINAL_SCHEMA)

      board_attributes = original_project.boards.all.map do |board|
        board.attributes.keep_if { |k, _| BOARD_ATTRIBUTES.include? k }
      end

      Apartment::Tenant.switch!(user.tenant_key)

      board_attributes = board_attributes.map { |board| board.merge(root_project_id: project.id) }

      project.update!(boards_attributes: board_attributes)

      original_project.boards.each do |board|
        Apartment::Tenant.switch!(ORIGINAL_SCHEMA)
        cols = columns_attributes(board)

        Apartment::Tenant.switch!(user.tenant_key)

        board.columns.each do |column|
          Apartment::Tenant.switch!(ORIGINAL_SCHEMA)
          cards = cards_attributes(column).map { |card| card.merge(board: board)}

          Apartment::Tenant.switch!(user.tenant_key)
          column.update!(cards_attributes: cards)

          column.cards.each do |card|
            Apartment::Tenant.switch!(ORIGINAL_SCHEMA)
            card_items = card_items_attributes(card)

            # TODO: Card items
          end
        end
      end

      project
    end

    private def build_demo_project
      project_attributes = original_project.attributes.keep_if { |k, _| PROJECT_ATTRIBUTES.include? k }
                               .merge(owner: user)

      board_attributes = original_project.boards.all.map do |board|
        board.attributes.keep_if { |k, _| BOARD_ATTRIBUTES.include? k }
            .merge(columns_attributes: columns_attributes(board))
      end


      project_attributes.merge(boards_attributes: board_attributes)
    end

    private def columns_attributes(board)
      board.columns.map do |column|
        column.attributes.keep_if { |k, _| COLUMN_ATTRIBUTES.include? k }
      end
    end

    private def cards_attributes(column)
      column.cards.map do |card|
        card.attributes.keep_if { |k, _| CARD_ATTRIBUTES.include? k }
      end
    end

    private def card_items_attributes(card)
      card.card_items.map do |card_item|
        card_item.attributes.keep_if { |k, _| CARD_ITEM_ATTRIBUTES.include? k }
            .merge(note_attributes: card_item_details_attributes(card_item))
      end
    end

    private def card_item_details_attributes(card_item)
      card_item.item.attributes.keep_if { |k, _| CARD_ITEM_DETAILS_ATTRIBUTES.include? k }
    end
  end
end