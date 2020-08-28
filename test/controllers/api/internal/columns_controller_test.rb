require 'test_helper'

class Api::Internal::ColumnsControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  def setup
    @user = users(:default)
    @board = boards(:default)
    @column = @board.columns.order(:position).first
    login_user(@user)
  end

  def test_update_column
    put :update, params: {
      uuid: @column.uuid,
      column: {
        name: 'New Name',
        position: 999
      }
    }

    @column.reload

    assert_equal 'New Name', @column.name
    assert_equal 999, @column.position
  end
end
