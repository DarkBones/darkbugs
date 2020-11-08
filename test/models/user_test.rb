require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def test_create_demo_user
    user = User.create_demo_user

    assert_not_nil user
    assert_not_nil user.id
    assert_not_nil user.user_profile

    assert_not_nil user.email
    assert_not_nil user.name
    assert_not_nil user.username
    assert_not_nil user.uuid

    assert_not_nil user.user_profile.first_name
    assert_not_nil user.user_profile.last_name
    assert_not_nil user.user_profile.bio

    puts user.user_profile.bio

    assert user.demo_user

    assert_not_nil Tenant.find_by!(key: user.uuid)
  end
end