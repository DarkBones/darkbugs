module Projects
  class CreateDemoProjectService < BaseService
    attr_reader :user, :original_project, :demo_project

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

      switch_original_schema
      @original_project = Project.find_by!(key: ORIGINAL_PROJECT)
    end

    def execute
      Project.transaction do
        create_demo_project
      end
    end

    private def create_demo_project
      @demo_project = create_project

      create_boards
      create_columns
      create_cards

      switch_demo_schema

      demo_project
    end

    private def create_project
      switch_original_schema
      attributes = original_project.attributes
                       .keep_if { |k, _| PROJECT_ATTRIBUTES.include? k }
                       .merge(owner: user)

      switch_demo_schema

      result = Project.create!(attributes)

      result.boards.destroy_all

      result
    end

    private def create_boards
      switch_original_schema
      attributes = original_project.boards
                       .map { |board| board.attributes.keep_if { |k, _| BOARD_ATTRIBUTES.include? k }}

      switch_demo_schema

      attributes.each do |board_attributes|
        demo_project.boards.create!(board_attributes.merge(root_project: demo_project))
      end
    end

    private def create_columns
      switch_original_schema
      boards = original_project.boards.dup

      boards.each do |board|
        switch_demo_schema # TODO: Test above baords.each scope
        demo_board = demo_project.boards.find_by!(slug: board.slug)

        switch_original_schema
        columns = board.columns.dup

        columns.each do |column|
          switch_demo_schema
          demo_board.columns.create!(
            column.attributes.keep_if { |k, _| COLUMN_ATTRIBUTES.include? k}
          )
        end
      end
    end

    private def create_cards
      switch_original_schema
      original_project.boards.each do |board|
        switch_demo_schema
        demo_board = demo_project.boards.find_by!(slug: board.slug)

        board.columns.each do |column|
          switch_demo_schema
          demo_column = demo_board.columns.find_by!(name: column.name)

          switch_original_schema
          cards = column.cards.dup

          cards.each do |card|
            switch_demo_schema
            demo_card = demo_column.cards.create!(
              card.attributes.keep_if { |k, _| CARD_ATTRIBUTES.include? k }
                  .merge(board: demo_board, assignee_id: user.id)
            )

            switch_original_schema
            card_items = card.card_items.dup

            card_items.each do |card_item|
              switch_demo_schema
              demo_card_item = demo_card.card_items.create!(
                  card_item.attributes.keep_if { |k, _| CARD_ITEM_ATTRIBUTES.include? k}
                      .merge(author_id: user.id)
              )

              switch_original_schema
              card_item_item = card_item.item.dup

              switch_demo_schema
              demo_card_item_item = card_item.item_type.titleize.constantize
                  .create!(
                      card_item_item.attributes.keep_if { |k, _| CARD_ITEM_DETAILS_ATTRIBUTES.include? k }
                          .merge(card_item_id: demo_card_item.id)
                  )
            end
          end
        end
      end
    end

    private def switch_original_schema
      Apartment::Tenant.switch!(ORIGINAL_SCHEMA)
    end

    private def switch_demo_schema
      Apartment::Tenant.switch!(user.tenant_key)
    end
  end
end