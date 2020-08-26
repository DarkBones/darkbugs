require 'test_helper'

module Users
  class RegistrationsControllerTest < ActionController::TestCase
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
      post :create
      assert_response :success
      assert_includes response.body, 'Email can&#39;t be blank'
      assert_includes response.body, 'Password can&#39;t be blank'
      assert_template :new
    end

    def test_create_mismatch_passwords
      params = {
        user: {
          user_profile_attributes: {
            username: 'testusername'
          },
          email: 'mismatch@test.test',
          password: '&v)&8YAU~]HkqVA',
          password_confirmation: 'e!C]7+xJ)w/:+$u6'
        }
      }

      post :create, params: params
      assert_includes response.body, 'Password confirmation doesn&#39;t match Password'
    end

    def test_create
      params = {
        user: {
          user_profile_attributes: {
            username: 'testusername'
          },
          email: 'new_user@test.test',
          password: '&v)&8YAU~]HkqVA',
          password_confirmation: '&v)&8YAU~]HkqVA'
        }
      }

      post :create, params: params
      assert_response :redirect
      assert_equal 'new_user@test.test', User.last.email
    end
  end
end
