require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  def test_owners
    assert projects(:default).owner.is_a? User
    assert projects(:organization).owner.is_a? Organization
  end
end
