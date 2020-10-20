require 'test_helper'

class UserTest < ActiveSupport::TestCase
  def test_create_demo_user
    key = 'test_key'
    user = User.create_demo_user(key)

    assert_not_nil user
    assert_not_nil user.id
    assert_not_nil user.user_profile

    assert_not_nil user.email
    assert_not_nil user.name

    assert user.demo_user
  end
end