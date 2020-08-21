require 'test_helper'

class OrganizationsControllerTest < ActionController::TestCase
  include Devise::Test::ControllerHelpers

  def setup
    @user = users(:default)
    @request.env['HTTP_HOST'] = 'host'
    @organization = organizations(:default)
    sign_in @user
  end

  def test_index
    get :index

    names = ['Your own space' ,'0000 first', 'default', 'test']
    messages = ['Created on', 'Created on', 'Created on', 'Member since']

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

    assert_response :bad_request
    assert_template :new
    assert_match 'Name is already taken', flash[:error]
  end

  def test_create_fail_empty_name
    post :create

    assert_response :bad_request
    assert_template :new
    assert_match "Name can't be blank", flash[:error]
  end

  def test_show
    get :show, params: { slug: @organization.slug }

    assert_response :success
    assert_template :show
  end

  def test_add_members
    get :add_members, params: { organization_slug: @organization.slug }

    assert_response :success
    assert_template :add_members
  end

  def test_create_members_empty
    post :create_members, params: {
      organization_slug: @organization.slug,
      organization: {
        usernames: ''
      }
    }

    assert_response :bad_request
    assert_includes response.body, "Usernames can't be blank"
  end

  def test_create_members
    post :create_members, params: {
      organization_slug: @organization.slug,
      organization: {
        usernames: "nonexistinguser\r\ndefault_username\r\nunconfirmed"
      }
    }

    assert_response :success
    assert_template :add_members_results
    assert_includes response.body, 'User not found'
    assert_includes response.body, 'User is already a member'
    assert_includes response.body, 'User successfully invited'
  end

  def test_create_members_non_admin
    post :create_members, params: {
      organization_slug: organizations(:test).slug,
      organization: {
        usernames: 'test\r\ndefault_username\r\nunconfirmed'
      }
    }

    assert_response :bad_request
    assert_match 'Only administrators can take this action', flash[:error]
  end

  def test_create_duplicate_case_insensitive
    post :create, params: {
      organization: {
        name: 'test duplicate name'
      }
    }

    post :create, params: {
      organization: {
        name: 'Test Duplicate Name'
      }
    }

    assert_response :bad_request
    assert_template :new
    assert_match 'Name is already taken', flash[:error]
  end

  def test_grant_admin_privileges
    user = users(:test)
    user_organization = UserOrganization.find_by!(user: user, organization: @organization)

    assert_equal UserOrganization::ROLES[:MEMBER], user_organization.role

    put :grant_admin, params: {
      slug: @organization.slug,
      user_uuid: user.uuid
    }

    assert_equal UserOrganization::ROLES[:ADMIN], user_organization.reload.role
  end

  def test_revoke_admin_privileges
    user = users(:test)
    user_organization = UserOrganization.find_by!(user: user, organization: @organization)
    user_organization.update!(role: UserOrganization::ROLES[:ADMIN])

    assert_equal UserOrganization::ROLES[:ADMIN], user_organization.role

    put :revoke_admin, params: {
      slug: @organization.slug,
      user_uuid: user.uuid
    }

    assert_equal UserOrganization::ROLES[:MEMBER], user_organization.reload.role
  end

  def test_fail_grant_as_non_admin
    sign_in users(:test)

    user = users(:locked)
    user_organization = UserOrganization.find_by!(user: user, organization: @organization)

    assert_equal UserOrganization::ROLES[:MEMBER], user_organization.role

    assert_no_difference 'Organization.count' do
      put :grant_admin, params: {
        slug: @organization.slug,
        user_uuid: user.uuid
      }

      assert_equal UserOrganization::ROLES[:MEMBER], user_organization.reload.role
      assert_match 'Only administrators can take this action', flash[:error]
    end
  end

  def test_fail_revoke_as_non_admin
    sign_in users(:test)

    user = users(:locked)
    user_organization = UserOrganization.find_by!(user: user, organization: @organization)
    user_organization.update!(role: UserOrganization::ROLES[:ADMIN])

    assert_equal UserOrganization::ROLES[:ADMIN], user_organization.role

    put :revoke_admin, params: {
      slug: @organization.slug,
      user_uuid: user.uuid
    }

    assert_equal UserOrganization::ROLES[:ADMIN], user_organization.reload.role
    assert_match 'Only administrators can take this action', flash[:error]
  end

  def test_fail_grant_same_user
    user_organization = UserOrganization.find_by!(user: @user, organization: @organization)
    assert_equal UserOrganization::ROLES[:CREATOR], user_organization.role

    put :grant_admin, params: {
      slug: @organization.slug,
      user_uuid: @user.uuid
    }

    assert_equal UserOrganization::ROLES[:CREATOR], user_organization.reload.role
    assert_match "You can't grant administrator privileges to yourself", flash[:error]
  end

  def test_fail_revoke_same_user
    user_organization = UserOrganization.find_by!(user: @user, organization: @organization)
    assert_equal UserOrganization::ROLES[:CREATOR], user_organization.role

    put :revoke_admin, params: {
      slug: @organization.slug,
      user_uuid: @user.uuid
    }

    assert_equal UserOrganization::ROLES[:CREATOR], user_organization.reload.role
    assert_match "You can't revoke your own administrator privileges", flash[:error]
  end

  def test_fail_grant_creator
    user = users(:test)
    user_organization = UserOrganization.find_by!(user: user, organization: @organization)
    user_organization.update!(role: UserOrganization::ROLES[:CREATOR])

    assert_equal UserOrganization::ROLES[:CREATOR], user_organization.role

    put :grant_admin, params: {
      slug: @organization.slug,
      user_uuid: user.uuid
    }

    assert_equal UserOrganization::ROLES[:CREATOR], user_organization.reload.role
    assert_match 'User is already an administrator', flash[:error]
  end

  def test_remove_member
    user = users(:test)

    assert_not_nil UserOrganization.find_by(user: user, organization: @organization)

    delete :remove_member, params: {
      slug: @organization.slug,
      user_uuid: user.uuid
    }

    assert_nil UserOrganization.find_by(user: user, organization: @organization)
  end

  def test_remove_member_fail_non_admin
    sign_in users(:test)

    user = users(:locked)

    delete :remove_member, params: {
      slug: @organization.slug,
      user_uuid: user.uuid
    }

    assert_not_nil UserOrganization.find_by(user: user, organization: @organization)
    assert_match 'Only administrators can take this action', flash[:error]
  end

  def test_delete_form
    get :delete, params: { organization_slug: @organization.slug }

    assert_response :success
    assert_template :delete
    assert_nil flash[:error]
  end

  def test_delete_form_non_admin
    sign_in users(:test)
    get :delete, params: { organization_slug: @organization.slug }

    assert_response :bad_request
    assert_match 'Only administrators can take this action', flash[:error]
  end

  def test_destroy
    post :destroy, params: { organization_slug: @organization.slug, organization: { name: @organization.name } }

    assert Organization.where(id: @organization.id).take.nil?
  end

  def test_destroy_name_mismatch
    post :destroy, params: { organization_slug: @organization.slug, organization: { name: 'mismatching_name' } }

    assert_not @organization.reload.nil?
    assert_match "The name doesn't match", flash[:error]
  end

  def test_destroy_non_admin
    sign_in users(:test)
    post :destroy, params: { organization_slug: @organization.slug, organization: { name: 'mismatching_name' } }

    assert_not @organization.reload.nil?
    assert_match 'Only administrators can take this action', flash[:error]
  end
end
