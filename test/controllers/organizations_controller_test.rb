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

    organization = Organization.last

    assert_response :success
    assert_equal 'new organization', organization.name
    assert_equal 'new-organization', organization.slug
  end

  def test_create_fail_duplicate
    2.times do
      post :create, params: {
        organization: {
          name: 'test duplicate name'
        }
      }
    end

    assert_response :success
    assert_template :new
    assert_includes response.body, 'Name is already taken'
  end
end
