require 'test_helper'

module Boards
  class CreateServiceTest < ActiveSupport::TestCase
    def test_create_from_project
      project = projects(:default)

      board = Boards::CreateService.new(project).execute

      assert_equal 'Features', board.name
      assert_equal board.root_project.id, project.id

      assert_equal ['Open', 'In Progress', 'Done', 'Released', 'Archived'], board.columns.pluck(:name)
      assert_equal (0..4).to_a, board.columns.pluck(:position)
    end

    def test_create_from_card
      card = cards(:default)

      board = Boards::CreateService.new(card, 'Test board').execute

      assert_equal 'Test board', board.name
      assert_equal board.root_project.id, card.board.root_project.id

      assert_equal ['Open', 'In Progress', 'Done', 'Released', 'Archived'], board.columns.pluck(:name)
      assert_equal (0..4).to_a, board.columns.pluck(:position)
    end
  end
end
