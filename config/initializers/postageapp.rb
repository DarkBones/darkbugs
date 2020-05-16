require 'postageapp'

PostageApp.configure do |config|
  config.api_key = Rails.application.credentials.postage_api_key
end
