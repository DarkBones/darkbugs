require 'test_helper'

module Organizations
  class AddUsersServiceTest < ActiveSupport::TestCase
    def setup
      @organization = organizations(:default)
      @usernames = "nonexistinguser\r\ndefault_username\r\nunconfirmed"
    end

    def test_add_users_tokens
      success = false

      results = AddUsersService.new(@organization, @usernames).execute
      results[:results].each do |result|
        if result[:status] == AddUsersService::SUCCESS
          success = true
          assert_not_nil result[:token]
        else
          assert_nil result[:token]
        end
      end

      assert success, 'Expected at lease one user to be successfully added'
    end
  end
end
