source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.7.1'

gem 'activestorage', '>= 6.0.3.1'
gem 'acts_as_list'
gem 'apartment', path: 'vendor/git/apartment'
gem 'azure-storage', '~> 0.15.0.preview', require: false
gem 'azure-storage-blob'
gem 'bootsnap', '>= 1.4.2', require: false
gem 'bootstrap-sass'
gem 'devise', '>= 4.7.1'
gem 'deep_cloneable', '~> 3.0.0'
gem 'faker', path: 'vendor/git/faker'
gem 'font-awesome-rails'
gem 'haml-rails', '>= 2.0'
gem 'jbuilder', '~> 2.7'
gem 'jquery-rails', '>= 4.4.0'
gem 'nested_form'
gem 'pg', '>= 0.18', '< 2.0'
gem 'postageapp', '>= 1.3.1'
gem 'puma', '~> 4.3'
gem 'rails', '~> 6.0.3'
gem 'rack-cors'
gem 'react-rails'
gem 'sass-rails', '>= 6'
gem 'simple_form'
gem 'sprockets-rails', '>= 2.3.2'
gem 'turbolinks', '~> 5'
gem 'tzinfo', '1.2.2'
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]
gem 'webpacker', '~> 4.0'

group :development, :test do
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]
  gem 'foreman'
  gem 'guard', '~>2.14.2', require: false
  gem 'guard-livereload', '~>2.5.2', require: false
  gem 'guard-minitest', '~>2.4.6', require: false
  gem 'listen', '~> 3.2'
  gem 'letter_opener', '>= 1.7.0'
  gem 'letter_opener_web', '>= 1.4.0'
  gem 'rack-livereload'
end

group :development do
  gem 'rubocop-rails', require: false
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
  gem 'web-console', '>= 3.3.0'
end

group :test do
  gem 'capybara', '>= 2.15'
  gem 'rails-controller-testing'
  gem 'selenium-webdriver'
  gem 'webdrivers'
end

group :production do
  gem 'sentry-raven'
end
