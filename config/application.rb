require_relative 'boot'

require 'rails/all'
require 'sprockets/railtie'
require 'apartment/elevators/subdomain'
require 'active_storage/engine'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Darkbugs
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # Throw errors when locales are missing or invalid
    config.i18n.enforce_available_locales = true

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]

    config.assets.paths << Rails.root.join('app', 'assets', 'fonts')

    config.middleware.use Apartment::Elevators::Subdomain

    Raven.configure do |config|
      config.dsn = 'https://52482a25aa0f47ab9ef981fc53a561f5:bdedeb2b35774e7a992dde9d356170ee@o437911.ingest.sentry.io/5401011'
    end
  end
end
