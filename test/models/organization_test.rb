require 'test_helper'

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @user = users(:default)
  end

  def test_accepted_scope
    @user.user_organizations.first.update!(accepted_at: nil)

    accepted = @user.organizations.accepted_by_user(@user)

    assert_not_equal @user.organizations.count, accepted.count
    accepted.each do |a|
      a.user_organizations.where(user: @user).each do |uo|
        assert_not_nil uo.accepted_at
      end
    end
  end

  def test_pending_scope
    pending = @user.organizations.pending_for_user(@user)

    assert_not_equal @user.organizations.count, pending.count
    pending.each do |p|
       p.user_organizations.where(user: @user).each do |uo|
        assert_nil uo.accepted_at
      end
    end
  end
end
