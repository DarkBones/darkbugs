require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  def test_owners
    assert projects(:default).owner.is_a? User
    assert projects(:organization).owner.is_a? Organization
  end

  def test_create_default_board
    project = Project.create!(name: 'test board', key: 'TBR', owner: users(:default))
    board = project.boards.first

    assert_not_nil board
    assert_equal 'Features', board.name
    assert_equal 'features', board.slug

    expected_columns = [
      [0, 'Open'],
      [1, 'In Progress'],
      [2, 'Done'],
      [3, 'Released'],
      [4, 'Archived']
    ]

    assert_equal expected_columns, board.columns.pluck(:position, :name)
  end
end
