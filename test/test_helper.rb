ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'

class ActiveSupport::TestCase
  include Devise::Test::ControllerHelpers
  include Warden::Test::Helpers
  Warden.test_mode!

  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...

  setup do
    @request.env['HTTP_HOST'] = 'host'
  end

  def login
    @user = users(:default)
    sign_in @user
  end

  def teardown
    Warden.test_reset!
  end
end
