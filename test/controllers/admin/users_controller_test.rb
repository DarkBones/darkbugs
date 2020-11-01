require 'test_helper'

class Admin::UsersControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  def test_user_index
    user = users(:default)
    user.update!(role: User::ADMIN_ROLE)
    login_user(user)

    get :index

    assert_response :success
    assert_template :index
  end

  def test_not_available_for_non_admin
    user = users(:default)
    login_user(user)

    get :index

    assert_response :redirect
    assert_equal 'Unauthorized', flash[:error]
  end
end
