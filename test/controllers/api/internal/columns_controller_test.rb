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
      api_version: Api::VERSION,
      uuid: @column.uuid,
      column: {
        name: 'New Name',
        position: 999
      }
    }

    @column.reload

    assert_equal 'New Name', @column.name
    assert_equal 999, @column.position

    assert_equal '{"name":"New Name","position":999,"uuid":"default_open"}', response.body
  end

  def test_update_column_fail_non_admin
    @user.user_organizations.update_all(role: UserOrganization::ROLES[:MEMBER])
    board = boards(:organization_project)
    column = board.columns.order(:position).first

    put :update, params: {
      api_version: Api::VERSION,
      uuid: board.columns.first.uuid,
      column: {
        name: 'New Name',
        position: 999
      }
    }

    column.reload

    assert_equal 'Open', column.name
    assert_equal 0, column.position
  end

  def test_create_column
    post :create, params: {
      api_version: Api::VERSION,
      board_slug: @column.board.slug,
      column: {
        name: 'New Column'
      }
    }

    column = Column.last
    assert_equal 'New Column', column.name
    assert_not_nil column.uuid
    assert_equal 5, column.position
  end

  def test_create_column_fail_non_admin
    @user.user_organizations.update_all(role: UserOrganization::ROLES[:MEMBER])
    board = boards(:organization_project)
    column = board.columns.order(:position).last

    post :create, params: {
      api_version: Api::VERSION,
      board_slug: column.board.slug,
      column: {
        name: 'New Column'
      }
    }

    assert_equal column, board.columns.order(:position).last
    assert_equal 'unauthorized', response.body
  end

  def test_delete_column
    delete :destroy, params: {
      api_version: Api::VERSION,
      uuid: @column.uuid
    }

    assert_nil Column.find_by(id: @column.id)
    assert_equal '{"uuid":"default_open"}', response.body
  end

  def test_delete_column_fail_non_admin
    @user.user_organizations.update_all(role: UserOrganization::ROLES[:MEMBER])
    board = boards(:organization_project)
    column = board.columns.order(:position).last

    delete :destroy, params: {
      api_version: Api::VERSION,
      uuid: column.uuid
    }

    assert_not_nil Column.find_by(id: column.id)
    assert_equal 'unauthorized', response.body
  end
end
