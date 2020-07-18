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

    assert_response :bad_request
    assert_template :new
    assert_includes response.body, 'Name is already taken'
  end

  def test_create_fail_empty_name
    post :create

    assert_response :bad_request
    assert_template :new
    assert_includes response.body, "Name can't be blank"
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
    assert_includes response.body, 'User doesn&#39;t exist'
    assert_includes response.body, 'User is already a member'
    assert_includes response.body, 'User successfully added'
  end

  def test_create_members_non_admin
    post :create_members, params: {
      organization_slug: organizations(:test).slug,
      organization: {
        usernames: 'test\r\ndefault_username\r\nunconfirmed'
      }
    }

    assert_response :bad_request
    assert_includes response.body, 'Only administrators can add members'
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
    assert_includes response.body, 'Name is already taken'
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

    put :grant_admin, params: {
      slug: @organization.slug,
      user_uuid: user.uuid
    }

    assert_equal UserOrganization::ROLES[:MEMBER], user_organization.reload.role
    assert_includes response.body, "Only administrators can grant administrator privileges"
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
    assert_includes response.body, "Only administrators can revoke administrator privileges"
  end

  def test_fail_grant_same_user
    user_organization = UserOrganization.find_by!(user: @user, organization: @organization)
    assert_equal UserOrganization::ROLES[:CREATOR], user_organization.role

    put :grant_admin, params: {
      slug: @organization.slug,
      user_uuid: @user.uuid
    }

    assert_equal UserOrganization::ROLES[:CREATOR], user_organization.reload.role
    assert_includes response.body, "You can't grant administrator privileges to yourself"
  end

  def test_fail_revoke_same_user
    user_organization = UserOrganization.find_by!(user: @user, organization: @organization)
    assert_equal UserOrganization::ROLES[:CREATOR], user_organization.role

    put :revoke_admin, params: {
      slug: @organization.slug,
      user_uuid: @user.uuid
    }

    assert_equal UserOrganization::ROLES[:CREATOR], user_organization.reload.role
    assert_includes response.body, "You can't revoke your own administrator privileges"
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
    assert_includes response.body, "User is already an administrator"
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
    assert_includes response.body, "Only administrators can remove members"
  end
end
