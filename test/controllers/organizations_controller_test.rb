require 'test_helper'

class OrganizationsControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  def setup
    @user = users(:default)
    @request.env['HTTP_HOST'] = 'host'
    sign_in @user
  end

  def test_index
    get :index

    names = ['0000 first', 'default', 'test']
    messages = ['Created on', 'Created on', 'Member since']

    assert_select "ul#organization_list" do |elements|
      elements.each do |element|
        assert_select element, "li" do |lis|
          lis.each_with_index do |li, idx|
            assert_includes li.text, names[idx]
            assert_includes li.text, messages[idx]
          end
        end
      end
    end
  end

  def test_create
    user_organization_count = @user.organizations.count
    post :create, params: {
      organization: {
        name: 'new organization'
      }
    }

    organization = Organization.last

    assert_response :redirect
    assert_equal 'new organization', organization.name
    assert_equal 'new-organization', organization.slug
    assert_equal user_organization_count + 1, @user.organizations.count
    assert_equal 1, organization.users.count
    assert_equal UserOrganization::ROLES[:CREATOR], @user.user_organizations.last.role
  end

  def test_slug
    name = '~!@#$%^&*()+=\test .. slug{}[]:;"''"'
    post :create, params: {
      organization: {
        name: name
      }
    }

    organization = Organization.last
    assert_equal 'test-slug', organization.slug
  end

  def test_create_fail_duplicate_name
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

  def test_create_fail_empty_name
    post :create

    assert_response :success
    assert_template :new
    assert_includes response.body, "Name can't be blank"
  end

  def test_show
    get :show, params: { id: organizations(:default).slug }

    assert_response :success
    assert_template :show
  end

  def test_invite_members
    get :new_members, params: { organization_slug: organizations(:default).slug }

    assert_response :success
    assert_template :new_members
  end

  def test_create_members_empty
    post :create_members, params: {
      organization_slug: organizations(:default).slug,
      organization: {
        usernames: ''
      }
    }

    assert_response :bad_request
    assert_includes response.body, "Usernames can't be blank"
  end

  def test_create_members
    post :create_members, params: {
      organization_slug: organizations(:default).slug,
      organization: {
        usernames: "test\r\ndefault_username\r\nunconfirmed"
      }
    }

    assert_response :success
    assert_template :add_members_results
    puts @response.body.to_yaml
  end
end
