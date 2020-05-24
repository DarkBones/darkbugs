require 'test_helper'

module Users
  class PasswordsControllerTest < ActionController::TestCase
    include Devise::Test::ControllerHelpers

    def setup
      @user = users(:default)
      @request.env["devise.mapping"] = Devise.mappings[:user]
    end

    def test_new
      get :new
      assert_response :success
      assert_template :new
    end

    def test_create_blank
      post :create
      assert_response :success
      assert_includes response.body, "Email can&#39;t be blank"
      assert_template :new
    end

    def test_create
      params = { user: { email: @user.email } }

      post :create, params: params
      assert_response :redirect
      assert_not_includes response.body, "Email can&#39;t be blank"
    end
  end
end
