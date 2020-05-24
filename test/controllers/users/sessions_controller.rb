require 'test_helper'

module Users
  class SessionsControllerTest < ActionController::TestCase
    include Devise::Test::ControllerHelpers

    def setup
      @user = users(:default)
      @request.env['devise.mapping'] = Devise.mappings[:user]
    end

    def test_new
      get :new
      assert_response :success
      assert_template :new
    end

    def test_create_blank
      post :create
      assert_response :success
      assert_includes response.body, 'Invalid Email or password'
      assert_template :new
    end

    def test_wrong_password
      params = {
        user: {
          email: @user.email,
          password: 'wrongpassword'
        }
      }

      post :create, params: params
      assert_response :success
      assert_includes response.body, 'Invalid Email or password'
      assert_template :new
    end

    def test_login
      params = {
        user: {
          email: @user.email,
          password: ENV['DEFAULT_TEST_PASS']
        }
      }

      post :create, params: params
      assert_not_includes response.body, 'Invalid Email or password'
      assert_response :redirect
    end
  end
end
