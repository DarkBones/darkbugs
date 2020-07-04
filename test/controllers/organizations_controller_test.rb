require 'test_helper'

class OrganizationsControllerTest < ActionController::TestCase
  def setup
    login
  end

  def test_create
    post :create, params: {
      organization: {
        name: 'new organization'
      }
    }

    assert_response :success
  end
end
