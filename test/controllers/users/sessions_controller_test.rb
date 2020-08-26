require 'test_helper'

module Users
  class SessionsControllerTest < ActionController::TestCase
    include Devise::Test::ControllerHelpers

    def setup
      @user = users(:default)
      Apartment::Tenant.create(@user.uuid)
      @request.env['devise.mapping'] = Devise.mappings[:user]
    end

    def test_new
      get :new
      assert_response :success
      assert_template :new
    end

    def test_create_blank
      skip "Fix warden errors"

      post :create
      assert_response :success
      assert_includes response.body, 'Invalid Email or password'
      assert_template :new
    end

    def test_wrong_password
      skip "Fix warden errors"

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

    def test_locked
      skip "Fix warden errors"

      user = users(:locked)
      params = {
        user: {
          email: user.email,
          password: ENV['DEFAULT_TEST_PASS']
        }
      }

      post :create, params: params
      assert_response :success
      assert_includes response.body, 'Your account is locked'
      assert_template :new
    end
  end
end
