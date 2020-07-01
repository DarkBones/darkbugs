class TranslationsController < ApplicationController
  def show
    require 'json'
    locale = YAML.load_file(File.open('config/locales/javascript/components/en.yml'))
    render json: locale
  end
end
