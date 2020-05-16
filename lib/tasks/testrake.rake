require 'fileutils'
require 'net/http'

namespace :testrake do
  desc 'Send test email'
  task send_test_email: [:environment] do
    puts 'this is a test'
  end
end
