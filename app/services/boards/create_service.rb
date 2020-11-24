module Boards
  class CreateService < BaseService
    attr_reader :model, :name

    def initialize(model, name = nil)
      name ||= I18n.t('models.board.features')

      @model = model
      @name = name
    end

    def execute
      Board.transaction do
        board = model.boards.create!(name: name, root_project_id: root_project_id)

        Board::DEFAULT_COLUMNS.each do |name|
          board.columns.create!(name: I18n.t("models.board.columns.#{name}"))
        end

        board
      end
    end

    private def root_project_id
      return model.id if model.is_a? Project

      model.board.root_project.id
    end
  end
end