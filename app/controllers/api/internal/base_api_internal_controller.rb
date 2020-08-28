module Api
  module Internal
    class BaseApiInternalController < ApplicationController
      skip_before_action :verify_authenticity_token

    end
  end
end
